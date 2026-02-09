import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="fixed inset-0 bg-black z-50 flex flex-col">
      
      <!-- Header (Auto-hide) -->
      <div 
        class="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300"
        [class.opacity-0]="!showControls() && isPlaying()"
        [class.pointer-events-none]="!showControls() && isPlaying()">
        <div class="flex items-center justify-between">
          <button 
            (click)="goBack()"
            class="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span class="font-medium">Back</span>
          </button>

          <h1 class="text-xl font-semibold text-white">
            {{ movieTitle() }}
          </h1>

          <div class="w-20"></div>
        </div>
      </div>

      <!-- Video Player -->
      <div class="flex-1 flex items-center justify-center relative"
           (mousemove)="onMouseMove()"
           (click)="togglePlayPause()">
        @if (loading()) {
          <app-loading-spinner text="Loading video..." />
        } @else if (streamUrl()) {
          <div class="w-full h-full">
            <video 
              #videoPlayer
              class="video-js vjs-big-play-centered w-full h-full"
              controls
              preload="auto"
              playsinline>
            </video>
          </div>
        } @else {
          <div class="text-center space-y-4">
            <svg class="w-24 h-24 mx-auto text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="text-white text-xl">Failed to load video stream</p>
            <p class="text-gray-400">Please check your subscription or try again later</p>
            <button 
              (click)="goBack()"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Go Back
            </button>
          </div>
        }
      </div>

      <!-- Custom Controls Overlay (Optional - Video.js has built-in controls) -->
      @if (!loading() && streamUrl() && showControls() && !isPlaying()) {
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button 
            (click)="togglePlayPause()"
            class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all pointer-events-auto">
            <svg class="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
    // ... existing styles ...

/* Video.js Custom Styling */
.video-js {
  font-family: 'Inter', system-ui, sans-serif;
}

.video-js .vjs-big-play-button {
  border: none;
  background-color: rgba(239, 68, 68, 0.9);
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.video-js:hover .vjs-big-play-button,
.video-js .vjs-big-play-button:focus,
.video-js .vjs-big-play-button:active {
  background-color: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.video-js .vjs-control-bar {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  height: 4em;
}

.video-js .vjs-play-progress,
.video-js .vjs-volume-level {
  background-color: #ef4444;
}

.video-js .vjs-slider {
  background-color: rgba(255, 255, 255, 0.2);
}

.video-js .vjs-load-progress {
  background: rgba(255, 255, 255, 0.3);
}

.video-js .vjs-button:hover,
.video-js .vjs-menu-button:hover {
  color: #ef4444;
}

.vjs-menu li.vjs-selected,
.vjs-menu li.vjs-selected:focus,
.vjs-menu li.vjs-selected:hover {
  background-color: #ef4444;
  color: white;
}

/* Quality Selector */
.vjs-quality-selector .vjs-menu .vjs-menu-content {
  background-color: rgba(0, 0, 0, 0.9);
}

.vjs-quality-selector .vjs-menu li {
  padding: 8px 16px;
  color: white;
}

.vjs-quality-selector .vjs-menu li:hover {
  background-color: rgba(239, 68, 68, 0.5);
}`
  ]
})
export class MoviePlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private toastService = inject(ToastService);

  @ViewChild('videoPlayer', { static: false }) videoPlayerRef?: ElementRef<HTMLVideoElement>;

  loading = signal(true);
  streamUrl = signal<string | null>(null);
  movieTitle = signal('');
  showControls = signal(true);
  isPlaying = signal(false);

  private player?: any;
  private controlsTimeout?: number;
  private movieId = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
      if (this.movieId) {
        this.loadStream(this.movieId);
      }
    });
  }

  ngAfterViewInit(): void {
    // Player initialization happens after stream URL is loaded
  }

  ngOnDestroy(): void {
    this.destroyPlayer();
  }

  loadStream(movieId: string): void {
    this.loading.set(true);

    // First get movie details for title
    this.movieService.getMovieById(movieId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.movieTitle.set(response.data.title);
        }
      }
    });

    // Then get stream URL
    this.movieService.getStreamUrl(movieId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.streamUrl.set(response.data);
          this.loading.set(false);
          
          // Initialize player after URL is available
          setTimeout(() => this.initializePlayer(), 100);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.error(error.error?.message || 'Failed to load video stream');
      }
    });
  }

  private initializePlayer(): void {
    if (!this.videoPlayerRef || !this.streamUrl()) return;

    const videoElement = this.videoPlayerRef.nativeElement;

    this.player = videojs(videoElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      responsive: true,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'liveDisplay',
          'seekToLive',
          'remainingTimeDisplay',
          'customControlSpacer',
          'playbackRateMenuButton',
          'chaptersButton',
          'descriptionsButton',
          'subsCapsButton',
          'audioTrackButton',
          'qualitySelector', // HLS quality selector
          'fullscreenToggle',
        ],
      },
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
      },
    });

    // Detect if URL is HLS (.m3u8) or DASH (.mpd)
    const url = this.streamUrl()!;
    
    if (url.includes('.m3u8')) {
      // HLS stream
      this.player.src({
        src: url,
        type: 'application/x-mpegURL',
      });
    } else if (url.includes('.mpd')) {
      // DASH stream
      this.player.src({
        src: url,
        type: 'application/dash+xml',
      });
    } else {
      // Regular MP4 or other format
      this.player.src({
        src: url,
        type: 'video/mp4',
      });
    }

    // Event listeners
    this.player.on('play', () => {
      this.isPlaying.set(true);
    });

    this.player.on('pause', () => {
      this.isPlaying.set(false);
    });

    this.player.on('ended', () => {
      this.isPlaying.set(false);
      this.showControls.set(true);
    });

    this.player.on('error', (error:any) => {
      console.error('Video player error:', error);
      this.toastService.error('Video playback error occurred');
    });

    // Enable HLS quality selector if available
    if (this.player.qualityLevels) {
      this.player.hlsQualitySelector({
        displayCurrentQuality: true,
      });
    }

    // Resume from saved position (optional - implement later)
    this.loadWatchProgress();
  }

  private destroyPlayer(): void {
    if (this.player) {
      // Save watch progress before destroying
      this.saveWatchProgress();
      this.player.dispose();
    }
  }

  togglePlayPause(): void {
    if (!this.player) return;

    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  goBack(): void {
    this.saveWatchProgress();
    this.router.navigate(['/movies', this.movieId]);
  }

  onMouseMove(): void {
    this.showControls.set(true);

    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }

    if (this.isPlaying()) {
      this.controlsTimeout = window.setTimeout(() => {
        this.showControls.set(false);
      }, 3000);
    }
  }

  private loadWatchProgress(): void {
    // Load from localStorage or backend
    const savedTime = localStorage.getItem(`movie_progress_${this.movieId}`);
    if (savedTime && this.player) {
      this.player.currentTime(parseFloat(savedTime));
    }
  }

  private saveWatchProgress(): void {
    if (this.player) {
      const currentTime = this.player.currentTime();
      localStorage.setItem(`movie_progress_${this.movieId}`, currentTime.toString());
    }
  }
}
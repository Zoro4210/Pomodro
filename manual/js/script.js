document.addEventListener('DOMContentLoaded', () => {
    const heroButton = document.getElementById('hero-image-button');
    const heroAudio = document.getElementById('hero-audio');
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (heroButton && heroAudio) {
        const setHeroPlayingState = (isPlaying) => {
            heroButton.classList.toggle('is-playing', isPlaying);
            heroButton.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
        };

        const playHeroAudio = async () => {
            try {
                heroAudio.currentTime = 0;
                await heroAudio.play();
                setHeroPlayingState(true);
            } catch (error) {
                setHeroPlayingState(false);
            }
        };

        const stopHeroAudio = () => {
            heroAudio.pause();
            heroAudio.currentTime = 0;
            setHeroPlayingState(false);
        };

        if (hoverCapable) {
            heroButton.addEventListener('mouseenter', () => {
                playHeroAudio();
            });

            heroButton.addEventListener('mouseleave', () => {
                stopHeroAudio();
            });
        } else {
            heroButton.addEventListener('click', async () => {
                if (heroAudio.paused) {
                    await playHeroAudio();
                } else {
                    stopHeroAudio();
                }
            });
        }

        heroButton.addEventListener('keydown', async (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            event.preventDefault();

            if (heroAudio.paused) {
                await playHeroAudio();
            } else {
                stopHeroAudio();
            }
        });

        heroAudio.addEventListener('ended', () => {
            setHeroPlayingState(false);
        });
    }

    // 1. Scroll Reveal Logic (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-up');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));


    // 2. Interactive Interactive 'Rotate to Lock In' Demo
    const demoDevice = document.getElementById('demo-device');
    const portraitUI = document.querySelector('.demo-portrait-ui');
    const landscapeUI = document.querySelector('.demo-landscape-ui');
    const countdownEl = document.getElementById('countdown');
    const finalTimerEl = document.getElementById('finalTimer');
    
    let isLandscape = false;
    let isAnimating = false;
    let mainTimerInterval = null;

    demoDevice.addEventListener('click', () => {
        if (isAnimating) return; // Prevent spam clicking during animation
        
        isAnimating = true;
        isLandscape = !isLandscape;

        if (isLandscape) {
            // Initiate the "Lock In" sequence
            demoDevice.classList.remove('portrait-standby');
            demoDevice.classList.add('landscape-active');
            
            portraitUI.classList.add('hidden');
            
            // Wait for rotation animation to complete before showing landscape UI
            setTimeout(() => {
                landscapeUI.classList.remove('hidden');
                landscapeUI.classList.add('visible');
                countdownEl.classList.remove('hidden');
                finalTimerEl.classList.add('hidden');
                
                // Commence 3-2-1 countdown
                triggerCountdown(3, () => {
                    // Final State: Timer shows
                    countdownEl.classList.add('hidden');
                    finalTimerEl.classList.remove('hidden');
                    isAnimating = false;
                    startMainTimer();
                });
            }, 600); // sync with CSS transition 0.8s
            
        } else {
            // Revert to Portrait
            demoDevice.classList.remove('landscape-active');
            demoDevice.classList.add('portrait-standby');
            
            landscapeUI.classList.remove('visible');
            landscapeUI.classList.add('hidden');
            
            if (mainTimerInterval) clearInterval(mainTimerInterval);
            
            setTimeout(() => {
                portraitUI.classList.remove('hidden');
                isAnimating = false;
            }, 600);
        }
    });

    // Countdown Helper Function
    function triggerCountdown(start, copyCallback) {
        let count = start;
        countdownEl.innerText = count;
        
        // Emulate pulse animation by removing and adding class
        countdownEl.style.animation = 'none';
        countdownEl.offsetHeight; /* trigger reflow */
        countdownEl.style.animation = 'pulseGlow 1s infinite alternate';

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.innerText = count;
            } else {
                clearInterval(interval);
                countdownEl.style.animation = 'none';
                if (copyCallback) copyCallback();
            }
        }, 1200); // 1.2s per tick for slightly dramatic feel
    }

    function startMainTimer() {
        let totalSeconds = 25 * 60; // 25 minutes
        
        function updateDisplay() {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
            finalTimerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        updateDisplay();
        
        if (mainTimerInterval) clearInterval(mainTimerInterval);
        
        mainTimerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else {
                clearInterval(mainTimerInterval);
            }
        }, 1000);
    }
});

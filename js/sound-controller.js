
const soundIcons = document.querySelectorAll('.sound-icon');
soundIcons.forEach(soundIcon => {
    soundIcon.addEventListener('click', () => {
        soundController.toggleSound();
    });
});

const soundController = {
    muted: false,
    volume: 0.5,

    toggleSound() {
        this.muted = !this.muted;
        this.volume = this.muted ? 0 : 0.5;
        soundIcons.forEach(soundIcon => soundIcon.classList.toggle('hidden'));
    }
}


export default soundController;
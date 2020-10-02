(function () {
    const playBtn = document.getElementById('play');
    const player = document.querySelector('.player');

    playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        video.play();
        player.classList.add('player-active');
    })

}())
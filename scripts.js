        // set the background image based on device type
        const bgElement = document.getElementById('bg-element'); // or document.body

        if (isMobile) {
            bgElement.style.backgroundImage = 'url("img/bg_mobile.jpg")';
        } else {
            bgElement.style.backgroundImage = 'url("img/bg_desktop.jpg")';
        }
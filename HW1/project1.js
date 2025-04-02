// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.

 function composite(bgImg, fgImg, fgOpac, fgPos) {
    let length = bgImg.width * bgImg.height * 4;
    for (let i = 0; i < length; i += 4) {
        let realIndex = i / 4;
        let bx = realIndex % bgImg.width;
        let by = Math.floor(realIndex / bgImg.width);
        let fx = bx-fgPos.x;
        let fy = by-fgPos.y;

        if (fx >= 0 && fx < fgImg.width && fy >= 0 && fy < fgImg.height) {
            let indexFG = (fy * fgImg.width + fx) * 4;
            let alpha = (fgImg.data[indexFG + 3] / 255) * fgOpac;
            bgImg.data[i] = alpha * fgImg.data[indexFG] + (1 - alpha) * bgImg.data[i]; // red
            bgImg.data[i + 1] = alpha * fgImg.data[indexFG + 1] + (1 - alpha) * bgImg.data[i + 1]; // green 
            bgImg.data[i + 2] = alpha * fgImg.data[indexFG + 2] + (1 - alpha) * bgImg.data[i + 2]; // blu
        }
    }
}
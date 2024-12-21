const Jimp = require('jimp');
const path = require('path');

function remakeImage(){
// 이미지 파일 경로와 출력 파일 경로를 설정합니다.
const inputImagePath = path.join(__dirname, 'input.jpg');
const outputImagePath = path.join(__dirname, 'output.jpg');

// 추가할 텍스트를 설정합니다.
const textToAdd = 'Hello, World!';

Jimp.read(inputImagePath)
  .then(image => {
    // 이미지 너비와 높이를 가져옵니다.
    const imageWidth = image.bitmap.width;
    const imageHeight = image.bitmap.height;

    // 폰트를 로드합니다.    
      Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(font => {
      // 텍스트 높이를 계산합니다.
      const textHeight = Jimp.measureTextHeight(font, textToAdd, imageWidth);
      
      // 새로운 이미지 높이 설정 (기존 이미지 높이 + 텍스트 높이 + 여백)
      const newImageHeight = imageHeight + textHeight + 40;

      // 새로운 이미지 생성 (투명한 배경)
      new Jimp(imageWidth, newImageHeight, 0xFFFFFFFF, (err, newImage) => {
        if (err) throw err;

        // 기존 이미지를 새로운 이미지에 붙여넣기
        newImage.composite(image, 0, 0);

        // 텍스트를 새로운 이미지 하단에 추가
        newImage.print(
          font,
          0,
          imageHeight + 10, // 이미지 하단에서 여백을 둠
          {
            text: textToAdd,
           // alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          },
          imageWidth,
          textHeight
        );

        // 새로운 이미지를 저장
        newImage.write(outputImagePath, () => {
          console.log(`Image saved to ${outputImagePath}`);
        });
      });
    });
  })
  .catch(err => {
    console.error('Error:', err);
  });
}

module.exports = {
  remakeImage
};

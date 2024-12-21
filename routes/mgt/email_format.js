<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="./css/styles.css" />
    <title>Detail</title>
    <style type="text/css">
      ul li{list-style: none;float:left;margin:20px 10px 20px 0;}
    </style>
  </head>
  <body>
    <style>
  .container {
      position: relative;
      width: 50%;
  }

  .image {
      display: block;
      width: 100%;
      height: auto;
  }

  .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 14px;
      font-weight: bold;
      text-align: left;      
  }
  .button-container {
        text-align: center;
        margin-bottom: 0; /* Ensure no margin at the bottom */
    }
    .button-container button {
        margin: 0; /* Ensure no margin on the button itself */
    }
</style>
<style>
  .thick-button {
      background-color: #160777; /* Green background */
      border: none; /* Remove borders */
      color: white; /* White text */
      padding: 15px 40px; /* Some padding */
      text-align: center; /* Centered text */
      text-decoration: none; /* Remove underline */
      display: inline-block; /* Make the link into a button */
      font-size: 24px; /* Increase font size */
      font-weight: bold; /* Make text bold */
      margin: 10px 2px; /* Some margin */
      cursor: pointer; /* Pointer/hand icon */
      border-radius: 8px; /* Rounded corners */
      box-shadow: 0 4px #999; /* Add a shadow */
  }

  .thick-button:hover {
      background-color: #2a0685; /* Darker green */
  }

  .thick-button:active {
      background-color: #080a73; /* Darker green */
      box-shadow: 0 2px #666; /* Decrease shadow */
      transform: translateY(4px); /* Move button down */
  }
  .image-container {
    position: relative;
    width: fit-content;
}

.base-image {
    display: block;
}

.overlay-image {
    position: absolute;
    top: 0px; /* 조정하고자 하는 y 좌표 */
    left: 0px; /* 조정하고자 하는 x 좌표 */
    width: 50px; /* 조정하고자 하는 너비 */
    height: 50px; /* 조정하고자 하는 높이 */
}

</style>
<p>
  <div class="container">
    <img src="https://allthemind.com/static/assets/img/email_title1.png" alt="" width="600" height="40" class="image">   
    
</div>
<div  width="600" >
  <div>STAMED NOTIFICATION</div>
  <div>
    <div>&nbsp;당신의 작품이 안전하게 ISTAM 블록체인에 저장되었습니다</div>
    <div>&nbsp;당신은 언제든지 블록체인에 저장된 당신의 작품을 확인할 수 있습니다</div>
    <div>
    <div>&nbsp;Your work is safely stored on the ISTAM blockchain. &nbsp;</div>
    <div>&nbsp;You can check your work stored on the blockchain at any time</div>
    </div>
  </div>
</div>

  <div class="container">
    <img src="https://allthemind.com/static/assets/img/email_title1.png" alt="" width="600" height="40" class="image"/>      
    <div class="text">Your Content's information</div></p>
  
    
</div>
  <div  width="600" >
    <ul>
      <div>. 등록일 : {date}</div>
      <div>. Stamping blockchain : Polygon mainnet&nbsp;</div>    
      <div>. IPFS(Image) :&nbsp;<a href="https://istam.quicknode-ipfs.com/ipfs/{Image}">https://istam.quicknode-ipfs.com/ipfs/{Image}</a></div>
      <div>. NFT :&nbsp;<a href="https://polygonscan.com/tx/{NFT}">{NFT}</a></div>
    </ul>
  </div>
  <div width="600">
    <div>iSTAM이란?</div>
    <div><strong>What is the </strong><strong>iSTAM</strong><strong>? </strong></div>
    <div>iSTAM assigns a date to your work based on blockchain.</div>
    <div>iSTAM determines the unique creation time of your uploaded work based on a public blockchain that cannot be forged or altered.</div>
    <div>Once your work has been given a date, you can also prove that the copyright or NFT was validly created. Also, introduce the uploaded file to your friends.</div>
    <div>Your friends can comment on the file and these comments will also be stored on the blockchain</div>
  </div>
    <button class="thick-button">SAHRE your STAM with friends</button>
</body>
</html>

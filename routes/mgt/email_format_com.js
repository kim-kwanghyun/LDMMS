<!doctype html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#000000">
    <title>i-STAM upload Report</title>
    <meta name="description" content="">
    <meta name="keywords" content="" />
    <link rel="icon" type="image/png" href="https://allthemind.com/static/assets/img/favicon.png" sizes="32x32">
    <link rel="apple-touch-icon" sizes="180x180" href="https://allthemind.com/static/mobile_assets/img/icon/192x192.png">
    <link rel="stylesheet" href="https://allthemind.com/static/mobile_assets/css/style.css">    
</head>
<style>
.truncate {
    width: 300px; /* 원하는 너비로 설정 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


</style>
<body>

  
    <div id="loader">
        <div class="spinner-border text-primary" role="status"></div>
    </div>


    <div class="appHeader" >
        <img src="https://allthemind.com/static/assets/img/email_title.png" alt="logo_image" width="400"/>       
    </div> 

   
    <div id="appCapsule">       
        <div class="section inset mt-4">
            <div class="carousel-full">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_Nag3X8p9h1ZX3vhIf-_ZdPBMyShe9xH6bbPgIO3M3xbMhPjctIaR7QtVW8HgXNJs05C0LbLvtJU0s3pPPh4oKVSbeEF1GZHC9aSK4qOIWTHgFCx47pSXwg64aUyBOeTa2FFHQ7tWFVbDIo=s0-d-e1-ft#https://istam.quicknode-ipfs.com/ipfs/QmQXUC6dbXoqKNyJpbQ3JxkUqugeomDDtDPrjEQXyQzNxS" 
                alt="alt" height="400px">
                    
            </div>  
        </div>
        
        <div class="section inset mt-4">
            <div class="section-title">STAMED NOTIFICATION </div>
            <div >
                <p style="font-size: 5px;">당신의 작품이 안전하게 ISTAM 블록체인에 저장되었습니다.
                <br>당신은 언제든지 블록체인에 저장된 당신의 작품을 확인할 수 있습니다.
                <br>Your work is safely stored on the ISTAM blockchain.
                <br>You can check your work stored on the blockchain at any time
                </p>
        </div>
        <div class="section inset mt-4">
            <div class="section-title">Information </div>
            <div class="wide-block pt-2 pb-2">
            Blockchain : Polygon
            <br>
            등록일 : {date}                         
            NFT:
            <br>
            <div class="truncate"><a href="https://polygonscan.com/tx/{NFT}">{NFT}</a></div>           
           
            IPFS(Image)
            <br>
            <div class="truncate"><a href="https://istam.quicknode-ipfs.com/ipfs/{Image}">https://istam.quicknode-ipfs.com/ipfs/{Image}</a></div>

        </div> 
        <div class="section inset mt-4"  >            
            <div class="section-title">iSTAM이란? </div>
            <p style="font-size: 10px;">
            What is the iSTAM?<br>
            iSTAM assigns a date to your work based on blockchain.<br>
            iSTAM determines the unique creation time of your uploaded work based on a public blockchain that cannot be forged or altered.<br>>
            Once your work has been given a date, you can also prove that the copyright or NFT was validly created. Also, introduce the uploaded file to your friends.<br>
            Your friends can comment on the file and these comments will also be stored on the blockchain<br>
        </p>
        </div> 
        <div class="section inset mt-4"  >
            <p style="font-size: 10px;"> https://www.allthemind.com/istamp/istam?istamp_list_seq=185</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm me-1 mb-1" onclick="copyText()">
            <ion-icon name="document-text-outline"></ion-icon>
            SAHRE your STAM with friends
        </button>
    </div>

    <!-- ============== Js Files ==============  -->
    <!-- Bootstrap -->
    <script src="/static/mobile_assets/js/lib/bootstrap.min.js"></script>
    <!-- Ionicons -->
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
    <!-- Splide -->
    <script src="/static/mobile_assets/js/plugins/splide/splide.min.js"></script>
    <!-- ProgressBar js -->
    <script src="/static/mobile_assets/js/plugins/progressbar-js/progressbar.min.js"></script>
    <!-- Base Js File -->
    <script src="/static/mobile_assets/js/base.js"></script>

</body>
<script>
    function goURL(){
        window.location = "https://allthemind.com/istamp/istam";
    }
    function gowhatisistam(){
      window.location.href = '/istamp/whatisistam';
    }    
</script>
<script>
    function copyText() {
        // 복사할 텍스트가 있는 요소 선택
        var textElement = document.getElementById("text-to-copy");
        // 새로운 텍스트 영역 생성
        var textArea = document.createElement("textarea");
        // 텍스트 영역에 텍스트 설정
        textArea.value = textElement.textContent;
        // 텍스트 영역을 화면에 보이지 않게 추가
        document.body.appendChild(textArea);
        // 텍스트 영역 내용 선택
        textArea.select();
        // 클립보드에 텍스트 복사
        document.execCommand("copy");
        // 텍스트 영역 제거
        document.body.removeChild(textArea);
        // 사용자에게 알림
        alert("공유URL이 복사되었습니다! 카톡이나 SNS 에 공유하시면 됩니다.");
    }
</script>
</html>
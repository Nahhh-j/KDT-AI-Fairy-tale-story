document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('webcam');
    const captureBtn = document.getElementById('captureBtn');
    const capturedImage = document.getElementById('capturedImage');
    const countdownDisplay = document.getElementById('countdown');
    const nextPageInput = document.getElementById('nextPageInput');

    let stream;

    // 웹캠 스트림 시작
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (mediaStream) {
            video.srcObject = mediaStream;
            stream = mediaStream;
        })
        .catch(function (err) {
            console.error('Could not access the webcam: ', err);
        });

    // 버튼 클릭 시 이미지 캡처
    captureBtn.addEventListener('click', function () {
        this.classList.add('hidden'); // 버튼 숨기기
        let counter = 10; // 카운트다운 시작 값
        countdownDisplay.textContent = counter; // 카운트다운 초기값 표시
        countdownDisplay.style.display = 'block'; // 카운트다운을 표시

        // countdownDisplay.textContent = counter; // 카운트다운 초기값 표시
        // countdownDisplay.style.display = 'block'; // 카운트다운을 표시
        // countdownDisplay.style.fontSize = '100px'; // 카운트 다운 디스플레이의 글꼴 크기 설정
        // countdownDisplay.style.backgroundColor = 'lightgrey'; // 카운트 다운 디스플레이의 배경 설정
        // countdownDisplay.style.borderRadius = '50%'
        // countdownDisplay.style.width = '150px'; // 가로 크기 설정
        // countdownDisplay.style.height = '150px'; // 세로 크기 설정
        // countdownDisplay.style.display = 'flex'; // 요소를 플렉스 박스로 설정하여 수평, 수직 중앙 정렬 가능
        // countdownDisplay.style.justifyContent = 'center'; // 수평 가운데 정렬
        // countdownDisplay.style.alignItems = 'center'; // 수직 가운데 정렬


        const intervalId = setInterval(function () {
            counter--; // 카운터 감소
            countdownDisplay.textContent = counter; // 카운트다운 업데이트

            if (counter <= 0) {
                clearInterval(intervalId); // 인터벌 종료
                countdownDisplay.style.display = 'none'; // 카운트다운 숨기기

                // 기존에 추가된 배경 제거된 이미지 삭제
                const previousRemovedBgImage = document.querySelector('.removed-bg-image');
                if (previousRemovedBgImage) {
                    previousRemovedBgImage.remove();
                }
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                capturedImage.src = canvas.toDataURL('image/jpeg');
                capturedImage.style.display = 'block';
                
                // CSRF 토큰 가져오기
                const csrftoken = getCookie('csrftoken');
                
                // 이미지 서버로 전송 (폼 데이터로 전송)
                const formData = new FormData();
                formData.append('image', canvas.toDataURL('image/jpeg'));
                formData.append('next_page', nextPageInput.value); 
                // formData.append('image', canvas.toDataURL('image/jpeg'));

                fetch('/capture/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken  // CSRF 토큰 추가
                    },
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    const nextPage = data.next_page
                    window.location.href = `/save/?next_page=${encodeURIComponent(nextPage)}`;
                })
                .catch(error => console.error('Error capturing image:', error));
            }
        }, 1000); // 1초마다 실행
    });

    // CSRF 토큰을 쿠키에서 가져오는 함수
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL이 필요합니다.' }), { status: 400 });
    }

    try {
        const startTime = new Date().getTime();

        // 외부 URL로 GET 요청
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const endTime = new Date().getTime();
        const delay = (endTime - startTime) / 1000;

        // 응답 헤더에서 서버 시간(Date) 가져오기
        const responseHeaders = response.headers;
        const serverDate = responseHeaders.get('Date');

        if (!serverDate) {
            throw new Error('서버 응답에서 Date 헤더를 찾을 수 없습니다.');
        }

        // 서버 시간 문자열을 Date 객체로 변환
        const parsedDate = new Date(serverDate);
        // to number
        const formattedDate = parsedDate;  // 한국어 형식으로 변환

        // 서버의 응답과 서버 시간을 클라이언트에 반환
        return new Response(
            JSON.stringify({
                delay,
                currentTime: formattedDate,  // 서버 시간
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('서버 요청 오류:', error);
        return new Response(
            JSON.stringify({ error: '서버 요청 실패' }),
            { status: 500 }
        );
    }
}

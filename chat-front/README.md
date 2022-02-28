## SVELTE-CHAT-FRONT

#### scripting
```bash
    # run
    npm run dev
    # test
    npm run test
    # test with coverage
    npm run test:coverage
    # lint
    npm run lint
```

#### folder
- animations
    - svelte 내부 애니메이션 함수 분리
- components
    - 각 page별 혼합 컴포넌트, 공용 컴포넌트
- e2eTest
    - cypress 테스트 파일
- lib
    - 사용자 함수 정의 ( api 통신용 server-proxy, 소켓 연동 지원 객체 socket)
- pages
    - 라우트 폴더
- stores
    - svelte에서 사용하는 공용 variable

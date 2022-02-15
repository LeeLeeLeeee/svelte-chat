# SVELTE-CHAT

### 소개
svelte로 구축한 프론트 환경과 go + echo로 구축한 API 서버간의 websocket 통신
Hub 객체를 활용하여 채팅방 토이 프로젝트 구축. 개발 환경 세팅은 docker 활용


### 실행 CLI
```bash
    cd chat-front && npm run dev
    cd ../ && go run *.go
```

### 기술 스택
#### front
- svelte
- svelte-kit
- vite

#### back
- go
- echo (서버 구축)
- gorilla/websocket (소켓 통신)

#### devops
- docker
- docker-compose
- traefik

#### test
- jest
- cypress

#### design
- tailwind css


### Directory
#### front - svelt
```bash
├── src
│   ├── animations # 커스텀 애니메이션 요소
│   ├── lib # web 통신 서비스 객체
│   ├── components # 컴포넌트 요소
│   │   ├── chat # chat 페이지에서 사용되는 component
│   │   ├── home # home 페이지에서 사용되는 component
│   │   ├── common # 공통 component
│   ├── pages # route와 매치되는 요소
│   ├── stores # svelte store
```
#### backend
```bash
├── static # 정적 파일
├── main.go # echo web-server 구축 
├── client.go # 클라이언트 서비스 객체
├── room.go # 룸 서비스 객체
├── lib.go # 공통 함수 모듈
```





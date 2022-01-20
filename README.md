# SVELTE-CHAT

### 소개
svelte로 구축한 프론트 환경과 go + echo로 구축한 API 서버간의 websocket 통신
redis를 pub-sub 기능을 활용하여 채팅방 토이 프로젝트 구축. 개발 환경 세팅은 docker 활용

### 기술 스택
#### front
- svelte
- svelte-kit
- socket.io

#### back
- go
- echo (서버 구축)
- gorilla/websocket (소켓 통신)
- redigo (레디스 관리)

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
│   ├── components # 컴포넌트 요소
│   │   ├── chat # chat 페이지에서 사용되는 component
│   │   ├── home # home 페이지에서 사용되는 component
│   │   ├── common # 공통 component
│   │   │   ├── modal
│   ├── pages # route와 매치되는 요소
│   ├── stores # svelte store
├── static # 정적 파일
```





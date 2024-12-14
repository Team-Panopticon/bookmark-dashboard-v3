## 24-11-13

- mousedown 시에 original element 숨기기
- PositionHolder의 col, row 세팅
- mouseup 핸들러에 위치 옮겼을 때 저장하는 로직 추가

## 24-11-16

마우스 다운 시에 깜빡이는 현상 수정하고 있었음...

## 24-11-20

- 전역상태 스토어로 bookmark를 관리하도록 한다.

## 24-11-23

- 전역 상태 스토어 하다가, 아이콘이 하나로 모이는 버그가 생김

## 24-11-27

- useFolderUp 만들다가 folder에서 mouseup 시에 이벤트가 발생 안하는 이슈 수정해야함

## 24-11-30

- DragingFile이 이벤트를 먹기 때문에 이 이벤트들을 어떻게 해야할지 고민해야함.

## 24-12-07

- [x] use folder up row col ~~계산해서 넣어주기~~ => auto로...? 고민해보기

  - 열려있는 폴더 / 폴더 아이콘에 넣어줄 때 마다 다르게 동작할것 같다

- [x] 드래깅 중일 때 원래 파일/폴더 보이게 하기

- (refactoring) 반복되는 row, col 구하는 로직 재사용하기

## 24-12-11

- 모달 Depths 구현 및 타이틀 적용
- 모달 히스토리 구현

- ContextMenu - 우클릭 처리

  - 빈 공간일 때
    CreateFolder --> 폴더 생기고, 아이콘 밑에 input
    CreateBookmark
  - 파일일 때
    - Edit
      - 폴더일 때 -> 이름만 변경 가능
      - 북마크일 때 -> 이름, URL 변경 가능
    - Delete

### Bugfix List

- 폴더 내에서 navigation이 안됨

- mouseup 시에 원래 위치에 아이콘이 살짝 보임

- 마우스 down 하고 그자리에서 up 시 드래그 상태가 유지됨

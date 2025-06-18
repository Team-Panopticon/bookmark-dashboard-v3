### 2025-03-26

https://www.figma.com/design/0OMnLwnx8dWrKzhyGZe1nA/Apple-Design-Resources---macOS-(Community)?node-id=103-8830&t=mYQU88gC94t5Aztm-0

- ## ui 개선 사항

  - [x] 폴더 헤더에서 아래 파일에 대한 컨텍스트 잡히는 현상 -> 컨텍스트 안되도록 수정
  - [x] folder header border height 늘어나는 현상
  - [x] 드래깅중 드래깅 파일에 대한 포커싱 - 제목만, 투명도
  - [x] ellipsis 색상 표현 오류
  - [x] text area 줄수 제한
  - [x] 타이틀 3글자 검토
  - [x] favicon
  - [ ] search
    - [ ] search 에서 키보드로 위아래 선택가능
      1. 좌 / 우 이동 시 입력 텍스트 커서 위치가 변경되어야함 (현재는 바깥 파일 focus가 바뀜)
      2. 상 / 하 이동 시 focus를 변경하지 말고, focusedIndex같은 내부 변수를 가지고 변경하기
          - input 영역 때문에 focus를 줄 수가 없음
          - focusedIndex와 같은 검색 결과에 스타일을 적용하고, 엔터 눌렀을 때 랜딩하게 내부 로직으로 구현
    - [ ] 단축키 cmd k + a
  - 팝업
    - [ ] 바탕화면
    - [ ] 다크모드
  - [ ] url 수정 팝업에서 favicon 수정
  - [ ] 북마크 드래그해서 폴더위로 호버시 폴더 focus 처리
  - [ ] 폴더 열리는 위치 수정 (같은 위치에 계속 열리고 있음)

- 버그만 핵심적인것만 고치고 배포일정

  추가 기능은 나중에

### Bugfix List

- [ ] 생성 시 간헐적으로 첫 번째 위치에 겹쳐서 생성됨 (조건은 모름)
- [x] 이름 변경 시 이전 아이콘에 변경창이 뜸 -> useMemo 디펜던시 배열에 timestampId가 없어서 이전 값을 참조하여 생긴 문제
  1. 1번 아이템 우클릭 + 이름변경
  2. 2번 아이템 클릭
  3. 2번 아이템 우클릭 + 이름변경
  4. 1번 아이템에 이름변경 input
- [ ] 새로고침 직후 간헐적으로 이름변경이 안됨
- [x] ~~폴더 내에서 navigation이 표시가 안됨~~
      ~~breadcrumb 구현~~ => MAC에 없으므로 구현하지 않는걸로 결정함
- [x] 폴더 title쪽에 우클릭할 때 아래 폴더 기준으로 context menu가 생성됨 (우클릭 안되도록)
- [x] mouseup 시에 원래 위치에 아이콘이 살짝 보임
- [x] 마우스 down 하고 그자리에서 up 시 드래그 상태가 유지됨
- [x] 마우스 클릭 시에 드래깅 표시(bg 회색)이 잠깐 보임
  - 마우스 다운 시에 보이는건데, 드래깅이 아니면 안보여야됨
- [x] Bookmark 삭제 시 LayoutDB와 동기화 안됨
- [x] 폴더 드래그해서 화면밖으로 나가는거 방지()
      기존(vue)에는 document에 mouseup을 추가해서 화면 밖에서 mouseup을 해도 mouseup을 감지할 수 있었음. 지금은 component에 이벤트를 추가해서 감지할 수 없음
- [x] 이동 시 북마크가 새로 생성됨 (브라우저 북마크 탭에서 이동됨) -> 이동되지 않도록
- [ ] 수정 창 ESC 클릭 시 닫히도록
- [ ] 폴더 아래로 스크롤하면 화면 전체가 아래로 내려감

### 추가 기능

- [x] 컨텍스트메뉴 주소바꾸기 구현(optional),URL 수정
      버튼 이름은 `정보 수정`?
      mac save dialog 디자인 / title, url 수정, 버튼들은 그대로, 상단에 favicon (없으면 안보여줌)
- [x] 검색기능
      float button + spotlight ui
- [x] focus keyboard 이동
- [x] favicon api 적용

- [ ] 폴더 타이틀 아래에 북마크 갯수 표시
- [ ] 바탕화면
- [ ] 드래깅 파일이 폴더위에 올렸을때 - 폴더에 대한 포커싱

- [ ] 실행 취소, 취소를 취소

  - 행동별로 이벤트를 저장해서 반대로 실행 (DELETE, MOVE, CREATE, ....)

- [ ] 삭제 할 때 알림? (폴더를 삭제하면 하위 북마크들도 다 삭제된다는...)
  - ~~mac은 안해준다 -> 휴지통이 있으니까~~
  - soft delete? 휴지통? ...
    1. 검색버튼 옆에 `...` 버튼 만들고 휴지통 드랍다운
    2. 검색버튼 옆에 휴지통 버튼
  - 폴더 삭제할 때
    전체 search 해서 다 저장하고....?
  - 복원할 때
    - 되돌아갈 위치가 차있으면 -> auto로 넣고 자동 배치 받기
    - 되돌아갈 부모 폴더가 없으면 -> 바탕화면에 집어넣기
- [x] 바탕화면에서 북마크 포커스후 빈공간에 우클릭시 메뉴표기가 북마크 메뉴표기로 나오는 현상

## 25-03-08

- [ ] 디자인 나눠서 진행
  - [ ] 포커스 디자인
  - [x] 컨텍스트 메뉴 디자인
  - [ ] 폴더(모달) 디자인
- [ ] 그리드 크기 조정
- [ ] 썸네일 스타일 및 적용

## 25-03-01

- [x] ~~폴더 내에서 navigation이 표시가 안됨~~ (구현 안함)
      breadcrumb 구현
- [x] 생성 시 간헐적으로 첫 번째 위치에 겹쳐서 생성됨 (조건은 모름)

## 25-02-26

- [x] 컨텍스트메뉴 폴더 생성 구현
- [x] 컨텍스트메뉴 멀티포커스 구현
  - focusedId가 저장되는 시점이랑 다시 focus를 클릭 할 때 시점이 달라서 timestamp가 달라서 포커스 해제가 불가함.
  - timestamp를 동일하게 할 수 있도록 수정

## 25-02-19(수)

- [x] 컨텍스트메뉴 삭제 구현

## 25-02-08(토)

- [x] edit 모드에서 수정 후 외부 클릭 시 저장을 해야됨

  현재 blur가 동작 안하고 있고, mousedown에서 focus가 바뀌면서 edit이 취소되고 있음

- ~~[ ] focus는 우리가 정의한 상태로만 관리~~
- ~~[ ] window에서 enter keyevent 를 수신하도록 수정~~

## 25-02-05(수)

- [x] 현재 focus를 전역 상태로 옮기기
  - [x] 버그)한 아이콘을 엔터로 수정하고, 다른 아이콘 클릭 후 엔터 시에 첫 아이콘이 수정모드로 변경됨
- [x] 전역상태로 Edit 상태 관리하도록 수정
- [ ] focus는 우리가 정의한 상태로만 관리
- [ ] window에서 enter keyevent 를 수신하도록 수정

## 25-02-01(토)

- 북마크 뷰 edit 모드에서 enter 클릭 시 변경사항 저장하기
- 컨텍스트메뉴 이름 변경 작업하기

## 25-01-25(토)

- 폴더/페이지에 대한 고유값이 필요
  - 폴더 여러개 띄우고 하나에 포커스 했을 때 하나의 폴더에만 포커스가 되도록

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

- [x] 모달 히스토리 구현

- ContextMenu - 우클릭 처리

  - 빈 공간일 때
    CreateFolder --> 폴더 생기고, 아이콘 밑에 input
    CreateBookmark
  - 파일일 때
    - Edit
      - 폴더일 때 -> 이름만 변경 가능
      - 북마크일 때 -> 이름, URL 변경 가능
    - Delete

## 24-12-14

- focus : 마우스 다운 시점에 무조건 focus []

  - focus가 되어있으면
    - 제목 클릭시 input으로 변경
    - Enter 키 입력 시 input으로 변경

- ContextMenu - 우클릭 처리

  - 빈 공간일 때
    CreateFolder --> 폴더 생기고, 아이콘 밑에 input
    CreateBookmark
  - 파일일 때

    - 포커스가 포함된 파일 일때
      - 포커스가 1개일때
        - 수정
        - 삭제
      - 포커스가 여러개 일때
        - 삭제
    - 포커스가 안된 파일 일때
      - 포커스 모두 지우고
      - 메뉴
        - 수정
          - 폴더일 때 -> 이름만 변경 가능
          - 북마크일 때 -> 이름, URL 변경 가능
    - Delete

  - 파일일 때

    - 포커스가 1개일 때
      수정
      삭제

    - 포커스가 여러개일 때
      삭제

    - 포커스가 안된 파일일 때
      새로운 파일을 포커스로 설정하고, "포커스가 1개일 때" 케이스 처리

## 24-12-21

14일에 하던 focus 처리 focus 추가는 됐고 삭제 해야됨

## 25-01-04

- 리팩토링 제안
  - 앱 구석구석 박혀있는 이벤트들을 종합해서 관리할 필요성을 느낌
  - 여러개로 나뉘어져 있는 스토어들의 값이 결국에 한번에 쓰이고 있는데 이 스토어들이 굳이? 나뉘어져 있어야하는가? 에 대한 고민
    - 일단 스토어를 하나로 합쳐보고 액션(이벤트)들을 새로 정의하면 좋을것 같음.

specific click event ->
observer
-> Folder(subscriber) -> method
-> Modal(subscriber) -> method
-> Desktop(subscriber) -> method
-> Something(subscriber) -> method
context

1. 이벤트가 너무 흩어져 있다.
2. 이벤트가 처리하는 데이터의 흐름이 파악이 안된다.
3.

```ts

const file = {
  // info , view naver
  key1:
  key2:
  focused: boolean
  isDragging:
  file
}

Bookmark Tree A -> B(name: nave)  -> E
                                  -> F
                -> C


View Info isEdit ?: boolean;

A -> B' (B: nave)
  -> B'' isEdit, input nave  (B: nave)

```

isEditing => 타겟 1개를 input

- 오른쪽 클릭을 하거나, desktop에 클릭을 하거나, 다른 파일/폴더를 클릭하거나
- 이벤트 다 걸어서 -> isEdit 함수를 호출해서 isEdit => false
- isEdit 상태가 풀려야함
- 놓치는 곳 없이 다 걸 수 있는가?
- 현재 구조로 되지 않겠다.
- 1. event를 관리해야하지 않을까?
- 2. 원본 상태가 있는데 각 스토어에서는 원본 상태가아니라 원본 상태를 기준으로 한 파생 상태를 사용하고 있다.
     - 이걸 해결하고 싶다.
     - focuseStore id만 가지고 있어서 -> getTree(id)

fileList : // a - b -c -d -e
{
[a-id]: a
[b-id]: b
[c-id]: c
[d-id]: d
[e-id]
}

{
isEditing: [id-id-id],
isDragging: ["1-B`", "2-B`"]
}

isEditing(){
return Object.entry.flatmap.foreach
}

```


{ isEditing: ["", "..."] }
{ }

naver- 1 naver- 2 nave-3

const fileStore = {
  state: fileList
  action -> 상태에 대한 변화 액션
  setFocused: (id) => file[focused] = false
  getFocusedFiles
}

react component => files.map(f => <File focused />) // focused view

const modalStore, contextMenusStore

const customHook = () => {
  const {data} = useFileStore();
  const modalEvent = useModalEvent();
  const contextMenuEvent = useContextMenu();
  const focusEvent = useFocusEvent();

  /**
   * 쓰는 데이터의 원류는 똑같은데 -> id값을 가져간다거나 조금씩 다르게 해서 사용하는
   */

  reutrn {
    modal:{
      click:() => {
        // ~~~
        // ~~~
      }
    },
    contextMenus : {

    }
  }
}
```

onContextClick = () => {
//
}
contextStore = {
subscribeWithSelector({
position,
setPosition,
})
}
useEffect(()=>{},[data])

// contextStore.subscribe(state => state.flag, 다른 스토어의 액션)

<div onClick={() => {onConetextclick}}></div>
folder.action();
modal.action();
desktop.action();
Something.action();
zustand - store- subscribe subscribeWithSelector

onConetextclick -4  
drag-n drop - 4

### 1월 8일

- event부터 다 커스텀 훅으로해서 모아보기

### 1월 11일

#### refactoring

- 네이밍 변경
  - 북마크
    - 페이지(기존 파일 대신)
    - 폴더
  - handler 이름 구체화하기
    - mouseUp, mouseDown
    - 동작을 표현하도록 수정(ex: handleClickCloseFolder, handleMouseUpFileDrop)
- rootStore 파일, useEventHandler 파일, type파일, utils? helper 함수 나누기
- rootStore로 기존 동작 다 바꾸기

#### feature

- context menu event 정의 <- 기능구의

### 참고

- [키맵 라이브러리](https://www.npmjs.com/package/react-shortcuts)

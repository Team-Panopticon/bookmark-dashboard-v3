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

### Bugfix List

- 폴더 내에서 navigation이 안됨

- mouseup 시에 원래 위치에 아이콘이 살짝 보임

- 마우스 down 하고 그자리에서 up 시 드래그 상태가 유지됨

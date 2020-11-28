---
title: "자료구조/👉알고리즘 - 15"
date: 2020-11-2 19:00:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 이진 탐색 - 1
2. 이진 탐색 - 2
3. 이진 탐색 - 3

## 이진탐색

탐색할 자료를 둘로 나누어 탐색하는 방법  

*__이진 탐색은 데이터가 정렬되어 있어야 한다.__*

중간 값과 비교하여 중간 값보다 찾고자 하는 값이  
더 작다면 왼쪽에 있다는 것이고,  
더 크다면 오른쪽에 있다는 것이다.  
따라서 이를 반복해서 찾는다.

1. 찾고자 하는 값이 중간 값보다 작으면 왼쪽 리스트에서 탐색 시작
2. 찾고자 하는 값이 중간 값보다 크면 오른쪽 리스트에서 탐색 시작
3. 1과 2를 반복

## 이진탐색 구현

```py
def binarySearch(list, value):
    if len(list) == 1:
        return value == list[0]
    elif len(list) == 0:
        return False
    
    mid = int(len(list) / 2)
    if value == list[mid]:
        return True
    elif value < list[mid]:
        return binarySearch(list[:mid], value)
    else:
        return binarySearch(list[mid + 1:], value)
```

![결과](/assets/images/fastchallenge/day15/결과1.PNG)

잘 구현되었다.  

## 탐색함수 점검함수(checkSearchFunc)

```py
def checkSearchFunc(func, wacnt = 10, warange = 10, maxrand=1000, elemcnt = 10, repeatcnt = 10):
    for i in range(repeatcnt):
        list = random.sample(range(maxrand), elemcnt + (wacnt - int(wacnt / 3) * 2))
        wa, list = list[elemcnt:], list[:elemcnt]
        list.sort()
        wa += random.sample(range(-warange, 0), int(wacnt / 3))
        wa += random.sample(range(maxrand, maxrand + warange), int(wacnt / 3))
        for e in list:
            result = func(list, e)
            if result == False:
                print("cannot find : ", e, " from :", list)
                return False
        for e in wa:
            result = func(list, e)
            if result == True:
                print("founded : ", e, " from :", list)
                return False
        return True
```

![결과2](/assets/images/fastchallenge/day15/결과2.PNG)

앞으로 이 함수를 통해서 탐색함수가 잘 작동하는지 알아보면 되겠다.

## 시간복잡도

매번 탐색시 두번으로 나뉘기에 $O(log n)$  

시간복잡도 : $O(log n)$

## 마지막

이분탐색은 굳이 재귀함수로 안짜도 된다.  
(재귀함수로 짜면 함수 스택이 쌓여서.. 사실 탐색을 직접짜서 쓸일이 거의 없다.)

![수강인증](/assets/images/fastchallenge/day15/수강인증.PNG)
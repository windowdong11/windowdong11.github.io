---
title: "[패스트캠퍼스 수강 후기] 알고리즘 / 기술면접👉코딩테스트인강 100% 환급챌린지 10회차 미션
"
date: 2020-10-28 17:20:00 +0400
categories: fastcampus-challenge Algorithm-Note
toc : true
usemathjax: true
---
# 학습기록

## 오늘 들은 강의 목록

1. 선택정렬
2. 삽입정렬

## 선택정렬(Selection Sort)

최소값을 탐색해서 맨 앞 값과 교체하는 것을 반복하여 정렬하는 알고리즘  

1. 첫번째 값부터 최소값을 찾는다.
2. 최소값과 첫번째 값을 스왑한다.
3. 첫번째 값(최소값)을 제외하고 1, 2번을 반복한다.(마지막에서 값이 첫번째 값이 될때까지)

1. i를 0으로 초기화시킨다.(i는 처음 값을 뜻한다. 사이클로 봐도 무방)
2. i번째 값부터 최소값을 찾는다.
3. 최소값과 i번째 값을 스왑한다.
4. i를 증가시킨다.
5. 1,2,3,4를 n-1번 반복한다.(n은 값의 갯수)

## 선택정렬 예시

3 5 -> 탐색 인덱스 : 0, 최소값 : 3
3 5 -> 탐색 인덱스 : 1, 최소값 : 5, 스왑(3, 3)
3 5 -> 마지막 값은

5 4 3 -> 탐색 인덱스 : 0, 최소값 : 5
5 4 3 -> 탐색 인덱스 : 1, 최소값 : 4
5 4 3 -> 탐색 인덱스 : 2, 최소값 : 3, 스왑(5, 3)
3 4 5 -> 탐색 인덱스 : 1, 최소값 : 4
3 4 5 -> 탐색 인덱스 : 2, 최소값 : 4, 스왑(4, 4)

## 선택정렬 구현

```py
import random
def checkSortFunc(func):
    isSorted = False
    for i in range(0, 10):
        list = random.sample(range(50), 10)
        func(list)
        for i in range(0, len(list)-1):
            if list[i] > list[i + 1]:
                isSorted = True
                return False
    return True
def SelectionSort(list):
    for i in range(0, len(list)-1):
        min = i
        for j in range(i, len(list)):
            if list[min] > list[j]:
                min = j
        list[i], list[min] = list[min], list[i]
print(checkSortFunc(SelectionSort))
```
실행결과는 당연히 True, 성공적으로 정렬되었다.  
![오름차순](/assets/images/fastchallenge/day10/오름차순.PNG)

checkSortFunc는 정렬하는 함수를 테스트하기 위한 함수,  
정상적으로 정렬되면 True,  
비정상적으로 정렬되면 False를 반환한다.  

아래는 내림차순으로 정렬하도록 함수를 변경하고 실행한 결과  
![내림차순](/assets/images/fastchallenge/day10/내림차순.PNG)

## 선택정렬 시간복잡도

버블소트처럼 $n(n-1)\over2$가 되겠지만  
빅오 표기법에 따라서 $O(n^2)$이 된다.

## 삽입정렬(Insertion Sort)

값을 올바른 위치에 삽입하면서 정렬한다.

1. 가장 앞에 있는 데이터를 선택한다.(맨 처음 데이터는 아래 과정을 거쳐도 같은 위치임, 따라서 두번째 데이터부터 실행)
2. 선택한 데이터의 앞에 있는 데이터가 더 작다면 앞에 있는 데이터를 뒤로 민다.
3. 앞에 있는 데이터가 더 클때까지 2를 반복한다.
4. 마지막으로 데이터를 밀어서 생긴 공간에 선택한 데이터를 넣는다.
5. 마지막 데이터까지 1~4를 반복한다.

## 삽입정렬 구현
```py
def InsertionSort(list):
    for i in range(1, len(list)):
        data = i
        for j in range(i - 1, -1, -1):
            if list[j] > list[data]:
                list[j], list[data] = list[data], list[j]
                data = j
            else:
                break
```

삽입정렬 실행 결과  
![삽입](/assets/images/fastchallenge/day10/insertion.PNG)

## 추가로 checkSortFunc 개선(정렬 실패 경우, 결과 출력)
```py
def checkSortFunc(func):
    isSorted = False
    for i in range(0, 10):
        list = random.sample(range(50), 10)
        func(list)
        for i in range(0, len(list)-1):
            if list[i] > list[i + 1]:
                print(list)#리스트 출력하도록 개선
                return False
    return True
```

## 마지막

9번째 챌린지에 실패했다는 메일이 왔다.  
혹시나 싶어서 깃헙에 들어가서 커밋 시간을 봤는데 11시 쯤인것 같은데,  
계속 이어졌으면 좋겠다.  
이어지지 않더라도 계속 50일간 기록을 남겨둬야지.  
엉엉 ㅠㅠ

# 내가 듣는 인강

**알고리즘 / 기술면접👉https://bit.ly/2FgOONG**
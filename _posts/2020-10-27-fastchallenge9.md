---
title: "[패스트캠퍼스 수강 후기] 알고리즘 / 기술면접👉코딩테스트인강 100% 환급챌린지 9회차 미션
"
date: 2020-10-27 22:33:00
categories: fastcampus-challenge Algorithm-Note
toc : true
---
# 학습기록
## 오늘 들은 강의 목록
1. 정렬 알고리즘 개요
2. 버블정렬 - 1
3. 버블정렬 - 2

## 알고리즘 연습 방법

알고리즘을 이해하고, 스스로 만들어보기

1. 노트 + 펜 -> 알고리즘 생각
2. 문제 분석
3. 간단한 케이스부터 해결방법 생각
4. 적용할 수 있는 알고리즘을 세부적으로 나누어서 생각을 정리(알고리즘 작성)
5. 지금까지 글로 작성한 것들을 코드로 작성
6. 테스트한다.
7. 1~6을 반복

---여기까지가 1번 강의 내용

## 버블정렬(Bubble Sort)

인접한 두 데이터를 비교하여 정렬하는 알고리즘  

![버블](/assets/images/fastchallenge/day9/Bubble-sort.gif)  

1. 맨 처음부터 인접한 두 데이터를 비교하여 앞의 데이터가 더 크다면, 서로 스왑한다.  
2. 가장 마지막 데이터까지 확인할때까지 다음 인덱스로 가서 위를 반복한다.  
3. 마지막 데이터가 확인되었으면, 처음 인덱스부터 시작해서 마지막 데이터를 제외하고 다시 시작한다.  
(마지막 데이터는 가장 큰 값으로 고정되었기 때문에 다음 사이클에서 비교하지 않는다.)  
4. 이를 더 이상 비교할 항목이 남지 않을 때까지 반복한다.  

막상 텍스트로 정리하려니 쉽지가 않네..

## 버블정렬 케이스

1. 2개의 데이터  
3 1 -> 1과 3 스왑  
1 3  

2. 3개의 데이터  
5 3 1 -> 5와 3 스왑  
3 5 1 -> 5와 1 스왑, (5는 가장 큰 수로 맨 뒤에 오게 됨, 다음 사이클에 비교하지 않는다)  
3 1 5 -> 1과 3 스왑  
1 3 5  

3. 4개의 데이터  
7 5 3 1 -> 7, 5  
5 7 3 1 -> 7, 3  
5 3 7 1 -> 7, 1, (7은 가장 큰 수로 맨 뒤에 오게 됨, 다음 사이클에 비교하지 않는다.)  
5 3 1 7 -> 5, 3  
3 5 1 7 -> 5, 1, (5는 가장 큰 수로 맨 뒤에 오게 됨, 다음 사이클에 비교하지 않는다.)  
3 1 5 7 -> 3, 1  
1 3 5 7  

## 버블소트 구현
```py
import random
def BubbleSort(list):
    for cycle in range(0, len(list) - 1):
        swapped = False
        for i in range(0, len(list) - cycle - 1):
            if list[i] > list[i + 1]:
                list[i], list[i + 1] = list[i + 1], list[i]
                swapped = True

        # 이 사이클에  한번이라도 스왑되지 않았다는 것은
        # 정렬되어있다는 것을 의미하므로 종료
        if not swapped:
            break

list = random.sample(range(50), 10)
print("before : ", list)
BubbleSort(list)
print("after : ", list)
```

## 결과확인
![결과](/assets/images/fastchallenge/day9/BubbleSortTest.PNG)  
실행을 통해 정상적으로 소트가 된다는 것을 확인 할 수 있었다.

## 다시 정리

1. swapped변수를 두고, 2번 이전에 False로 초기화한다.
2. 인접한 두 데이터를 비교하여 왼쪽 값이 더 크다면 스왑하고, swapped를 True로 설정한다. (오름차순 정렬)  
3. 2번을 맨 처음부터 마지막 데이터까지 반복한다.  
4. 추가 swapped가 False면, 종료한다.
5. 이제 마지막 데이터는 정렬이 된 상태이다.  
다음 2, 3번을 반복할때는 현재의 마지막 데이터를 제외하고 진행한다.
6. 정렬할 데이터가 없을때까지 반복한다.

## 시간복잡도

n개의 요소를 가진 리스트라 할때,  
최악의 경우 $\sum_{k=1}^{n-1} k$번 스왑하겠지만,  
시간복잡도는 빅오표기법에 의해 $\sum_{k=1}^{n-1} k = {(n-1)(n-2)\over2} = O(n^2)$가 된다.

## 마지막
![수강짤](/assets/images/fastchallenge/day9/수강인증.PNG)  
사진 한장은 이걸로 채워야지 히히

# 내가 듣는 인강
**알고리즘 / 기술면접👉https://bit.ly/2FgOONG**
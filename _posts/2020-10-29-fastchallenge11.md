---
title: "👉자료구조/알고리즘 - 11(패캠강의)"
date: 2020-10-29 17:20:00
categories: fastcampus-challenge DataStructure-Note
toc : true
usemathjax: true
---
# 학습기록
## 오늘 들은 강의 목록
1. 공간복잡도 - 1
2. 공간복잡도 - 2
3. 재귀 - 1

## 공간복잡도?

![공간](/assets/images/fastchallenge/day11/공간복잡도짤.PNG)

알고리즘의 효율을 판단하기 위한 기준은 시간복잡도와 공간복잡도로 표현될 수 있다.  

시간복잡도는 저번에 설명했듯이 얼마나 빠르게 실행하는지(문제를 해결하는지)를 나타내고,  
공간복잡도는 얼마나 많은 저장공간이 필요한지를 나타낸다.

대부분 둘 다 만족시키기는 어렵다.  
서로 반비례적인 관계다.  
요즘은 시간복잡도가 우선인데, 왜냐하면 옛날에는 메모리 등 공간이 부족했지만,  
현대에는 대부분 대용량으로 바뀌면서 공간이 부족하지 않기 때문
빅데이터 등에서는 신경쓴다고 함.

그럼에도 공간복잡도를 배우는 이유는,  
알고리즘 문제에는 메모리 제한이 걸려있기 때문이다.  
정해준 메모리 사용량을 넘으면 메모리 초과로 인해 틀렸다고 나온다.  
면접시 공간복잡도를 묻기도 한다고 함.

## 공간복잡도 (Space Complexity)

$S(P)=c+S_p(n)$
$c$ : 상수 공간
$S_p(n)$ : 가변 공간

## 공간복잡도 계산 1

```py
def factorial(n):
    if n > 1:
        return n * factorial(n - 1)
    else:
        return 1
```

공간복잡도 : $O(n)$

이 함수의 경우
factorial(n), factorial(n - 1), factorial(n - 2), ..., factorial(1)까지 실행된다.
factorial이 한번 실행될 때마다 생성되는 변수는 n으로 한개이다.  
factorial이 n번 실행되므로 공간복잡도는 O(n)과 같다.

## 공간복잡도 계산 2

```py
def factorial(n):
    fac = 1
    for index in range(2, n + 1):
        fac = fac * range
    return fac
```

공간복잡도 : $O(1)$
변수가 index와 fac 둘만 필요하기때문에 공간복잡도는 $O(1)$이 된다.

이처럼 공간복잡도는 변수의 갯수만큼 세면 된다.

## 재귀 호출 (recursive call)

함수 안에서 동일한 함수를 호출하는 형태  
여러 알고리즘 작성시 유용하게 작성된다  
재귀 호출을 안쓰고 구현할 수도 있지만 불편한경우도 꽤많다
(+ 재귀호출이 계속되면, 스택에 쌓여서 공간을 은근 차지하게 된다)

## 팩토리얼 재귀함수 구현

```py
def factorial(num):
    if num > 1:
        return num * factorial(num - 1)
    else:
        return num
for num in range(10):
    print(factorial(num))
```

![팩토리얼](/assets/images/fastchallenge/day11/팩토리얼구현.PNG)

사진처럼 잘 작동한다.

factorial(num) -> num * factorial(num - 1) -> num * num - 1 * factorial(num - 2) ...  
이런 형태로 작동하게 된다.

## 마지막

공간복잡도도 알아야한다.  
그렇게 어렵지않아서 그냥 금방 구할 수 있다.  
c같은 경우 자료형마다 크기가 정해져있어 사용되는 메모리 크기를 구할 수 있다.  
(파이썬은 변수 하나에 얼마나 먹는지 모르겠다. 찾아본적이 없어서)  

![수강인증](/assets/images/fastchallenge/day11/수강인증.PNG)  
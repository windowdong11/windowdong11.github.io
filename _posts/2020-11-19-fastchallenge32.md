---
title: "자료구조/👉알고리즘 - 23"
date: 2020-11-19 23:24:00
categories: fastcampus-challenge DataStructure-Note Algorithm-Note
toc : true
usemathjax: true
---
## 오늘 들은 강의 목록

1. 기본 정렬 핵심
2. 재귀 호출 핵심

## 나이순 정렬

[나이순 정렬](https://www.acmicpc.net/problem/10814)

간단한 키(나이)-값(이름)의 형태를 가진 데이터를 정렬하는 문제.  

```py
import queue
pq = queue.PriorityQueue()
n = int(input())
f = 0
for _ in range(n):
    p, name = input().split(' ')
    p = int(p)
    pq.put([p, f, name])
    f += 1
while not pq.empty():
    e = pq.get()
    print(e[0], e[2])
```

우선순위 큐를 이용해 입력받을때마다 정렬하도록 하는 방법

```py
n = int(input())
f = 0
l = []
for _ in range(n):
    p, name = input().split(' ')
    p = int(p)
    l.append([p, f, name])
    f += 1
l.sort()
for e in l:
    print(e[0], e[2])
```

입력 다 받고 정렬하도록 하는 방법

위 두 방식에서 f를 쓴 이유는 입력받은 순서를 위한 것인데,  
정렬 방식이 0번째 요소에서 비교, 1번째 요소에서 비교, 2번째 요소에서 비교하기때문이다.  

정렬할때 사용할 값을 지정하는 방법이 존재한다.  
이 방법을 사용하면 f를 사용하지 않아도 된다.

```py
n = int(input())
f = 0
l = []
for _ in range(n):
    p, name = input().split(' ')
    p = int(p)
    l.append([p, name])
ㅣ.sort(key=lambda x : x[0])
for e in l:
    print(e[0], e[1])
```

여기서 사용하는 sort에 **key**는 정렬할때 사용할 값을 나타낼 수 있다.  
lambda는 한줄 함수라고 생각하면 된다.  
**lambda 매개변수 : 반환값** 이러한 형식이다.

```py
lambda parameters : expression # <-이런 람다식은
def func(parameters): # <- 이런 함수처럼 동작
    return expression
```


## 좌표 정렬하기

[좌표 정렬하기](https://www.acmicpc.net/problem/11650)

이 문제는 위 문제보다 더 간단하다.  
그냥 입력받고 정수형 값을 가지는 리스트로 변환해서 리스트에 삽입 후,
sort 사용하면 끝난다.

```py
n = int(input())
f = 0
l = []
for _ in range(n):
    l.append(list(map(int, input().split(' '))))
l.sort()
for e in l:
    print(e[0], e[1])
```

## 수 정렬하기3

[수 정렬하기3](https://www.acmicpc.net/problem/10989)

최대로 주어지는 수들이 10,000,000개고, 시간제한이 3초라서 넉넉해보이는데,  
그냥 $O(nlogn)$으로 해도 되겠지?

> 입력받을 것들이 많으면 sys.stdin.readline()를 사용해야한다.  
> 입출력 하는데 걸리는 시간으로 인해서 시간초과가 난다.
```py
import sys
n = int(sys.stdin.readline())
s = [0 for _ in range(10001)]
for _ in range(n):
    s[int(sys.stdin.readline())] += 1
for e in range(10001):
    if s[e]:
        print('{}\n'.format(e) * s[e], end='')
```

데이터는 10,000,000개, 시간제한 3초, 메모리 8MB,  
시간은 넉넉한데 비해 메모리는 엄청 적다.

정수형을 4바이트라고 할때 40,000,000Byte는 약 40MB,  
-> 이 데이터들을 다 저장하라는게 아님
시간제한 3초에 NlogN? 232534966 가능하긴 하겠다.

그렇다면 데이터의 범위를 한번 보자.  
데이터의 범위는 1 ~ 10000으로, 10000000개의 데이터 중에서 중복이 엄청 많이 일어나겠다.  
그렇다면 1 ~ 10000범위의 숫자들의 갯수를 세서 출력하는건 어떨까?  
메모리도 40KB정도 들고, 시간복잡도도 $O(n)$이다.

숫자들의 갯수를 세서 정렬하는 방법은 Counting sort(계수 정렬)이라고 한다.

아래는 input사용하다가 시간초과 난 경우와 sys.stdin.readline() 사용해서 시간초과 해결한 경우

![10989](/assets/images/fastchallenge/day32/10989.PNG)

## 피보나치 수

[피보나치 수](https://www.acmicpc.net/problem/2747)

n번째 피보나치 수를 구하는 문제

```py
n = int(input())
memo = [0 for _ in range(n + 1)]
memo[1] = 1
for i in range(2, n+1):
    memo[i] = memo[i - 1] + memo[i - 2]
print(memo[n])
```

DP의 메모이제이션 이용해서 풀었다.

```py
n = int(input())
a, b = 0, 1
while n > 0:
    a, b = b, a + b
    n -= 1
print(a)
```

메모를 위한 변수를 단 두개를 사용해서 푸는 코드

![2747](/assets/images/fastchallenge/day32/2747.PNG)

1번이 위에서 처음으로 작성한 코드고,  
2번이 그 다음으로 작성한 코드다.  
두번째 코드가 시간도 더 빠르고 메모리도 훨씬 적겠다 생각했는데,  
메모리 사용량도 같고, 시간도 더 느렸다.  
또 중간에 있는 부분은 while을 for-range로 작성한 부분인데, 시간이 가장많이 걸렸다.  
(range에서 리스트를 생성해서 반환하는데 걸리는 시간인가부다)

## Z

[Z](https://www.acmicpc.net/problem/1074)

```py
def search(fx, tx, fy, ty, x, y):
    if fx + 1== tx:
        return 1
    mx, my = (fx + tx) // 2, (fy + ty) // 2
    block = (tx - mx) ** 2
    if x < mx:
        if y < my:
            res = search(fx, mx, fy, my, x, y)
            return res
        else:
            res = block + search(fx, mx, my, ty, x, y)
            return res
    else:
        if y < my:
            res = block * 2 + search(mx, tx, fy, my, x, y)
            return res
        else:
            res = block * 3 + search(mx, tx, my, ty, x, y)
            return res
n, x, y = list(map(int, input().split(' ')))
print(search(0, 2 << n, 0, 2 << n, x, y) - 1)
```

![1074](/assets/images/fastchallenge/day32/1074.PNG)

평면 [fx, tx), [fy, ty)에 대해 4등분하여,  
방문하는 순서대로 왼쪽 위를 0, 오른쪽 위를 1, 왼쪽 아래를 2, 오른쪽 아래를 3으로 두고,  
이들을 평면에 대해 부분공간이라고 할 때,

0번째 부분공간은 앞에 더 이상의 부분공간이 존재하지 않는다.  
1번째 부분공간은 앞에 1개 부분공간이 존재한다.  
2번째 부분공간은 앞에 2개 부분공간이 존재한다.  
3번째 부분공간은 앞에 3개 부분공간이 존재한다.  
따라서 **n번째 부분공간의 앞에는 n개의 부분공간이 존재한다.**  
이를 이용하여 평면에서 좌표(x, y)를 찾으려면,
n번째 부분공간에서 찾는데의 순서 + n개의 부분공간의 넓이를 통해 구할 수 있다.  
각 평면에서 하나의 부분공간의 넓이를 block이라 할때,
-> $block * n + search(n번째 부분공간 영역, x, y)$이라 할 수 있다.

block = 한 변의 길이를 $(fx + tx)/2$로 하는 정사각형 형태의 부분공간

## 0 만들기

[0 만들기](https://www.acmicpc.net/problem/7490)
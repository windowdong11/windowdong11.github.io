---
title: "자료구조/👉알고리즘 - 34"
date: 2020-11-21 18:00:00
categories: fastcampus-challenge Problem-Solving
toc : true
usemathjax: true
---
## 내용

1. 기본 탐색 - 기초

## 문서 검색

[문서 검색](https://www.acmicpc.net/problem/1543)

두 문자열이 주어진다.  
처음 문자열을 문서, 두번째 문자열을 단어라고 할때,  
문서에서 문자열이 몇번 **중복되지 않도록** 등장하는지 횟수를 세는 문제,  
"ababababa"  
"aba"  
-> **aba**b**aba**ba  
맨 처음에 **ab*aba***에서 {0, 1, 2 번째 글자} 그룹과,  
{2, 3, 4 번째 글자} 그룹은 서로 2번째 글자가 겹치기 때문에 세지 않는다.

문서의 길이(d) 2500, 단어의 길이(w) 50
시간제한 2초/ 메모리 제한 128MB

완전탐색으로 $O(dw) = d*w = 125000$정도면 가능하겠다.

```py
d = input()
w = input()
cnt = 0
i = 0
while i < len(d) - len(w) + 1:
    found = True
    for k in range(len(w)):
        if d[i + k] != w[k]:
            found = False
            i += 1
            break
    if found:
        i += len(w)
        cnt += 1
print(cnt)
```

1. 문서의 첫 글자부터 차례대로 선택
2. 선택한 글자의 해당 위치부터 w와 일치하는 지 확인
3. 일치하는 경우 일치하는 수 + 1, w의 길이만큼 건너뛰고, 다음 글자 선택, 2번부터 반복
4. 일치하지 않는 경우 다음 글자 선택, 2번부터 반복

![문서](/assets/images/fastchallenge/day34/문서.PNG)

약간 더 보기좋은 코드  
문자열 비교를 슬라이싱을 통해 비교할 수 있다.

```py
d = input()
w = input()
i = 0
result = 0
while len(d)  - i >= len(w):
    if d[i : i + len(w)] == w:
        result += 1
        i += len(word)
    else:
        i += 1
print(result)
```

## 새

[새](https://www.acmicpc.net/problem/1568)

최대 1,000,000,000
시간제한 2초

다들 문제에 적힌대로 생각하고,  
이게 시간안에 될까? 라는 생각을 할텐데,  
1+2+3+...하다보면 빠르게 커진다.  

가장 반복횟수가 큰 첫 사이클에서의 시간(초)를 구해보자
$1,000,000,000 = {n(n+1)\over2}$  
$2,000,000,000 = n^2 + n$  
$n \fallingdotseq 44721$

대략 $O(\sqrt n)$정도 나오겠다.

```py
n = int(input())
i = 1
t = 0
while n:
    if i <= n:
        n -= i
    else:
        i = 1
        n -= i
    i += 1
    t += 1
print(t)
```

![새](/assets/images/fastchallenge/day34/새.PNG)

## 베스트셀러

[베스트셀러](https://www.acmicpc.net/problem/1302)

팔린 책의 이름 목록을 통해 가장 많이 팔린 책의 이름을 구하는 문제

```py
d = input()
w = input()
cnt = 0
i = 0
while i < len(d) - len(w) + 1:
    found = True
    for k in range(len(w)):
        if d[i + k] != w[k]:
            found = False
            i += 1
            break
    if found:
        i += len(w)
        cnt += 1
print(cnt)
```

![베스트셀러](/assets/images/fastchallenge/day34/베스트셀러.PNG)

## 마지막

내용
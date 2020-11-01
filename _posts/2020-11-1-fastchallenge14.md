---
title: "[패스트캠퍼스 수강 후기] 알고리즘 / 기술면접👉코딩테스트인강 100% 환급챌린지 14회차 미션
"
date: 2020-11-1 14:58:00
categories: fastcampus-challenge Algorithm-Note
toc : true
mathjax: true
---
# 학습기록

## 오늘 들은 강의 목록

1. 병합정렬 - 1
2. 병합정렬 - 2
3. 병합정렬 - 3
4. 병합정렬 - 4

## 병합정렬

리스트를 가장 작게 잘라서 정렬하고 병합하여 정렬하는 것을 반복하는 알고리즘
대부분 재귀를 통해서 구현한다.

1. 리스트를 더 이상 나눌 수 없을 때까지 반으로 나눈다.
2. 나눠진 두개의 리스트를 정렬하며 더 이상 합칠 리스트가 없을 때까지 합친다.

![움짤](/assets/images/fastchallenge/day14/MergeSort.gif)

## 병합정렬 예시

[5, 6, 3, 4, 7, 2]  
[5, 6, 3] / [4, 7, 2]  
[5, 6] / [3] / [4, 7] / [2]  
[5] / [6] / [3] / [4] / [7] / [2]  
정렬하며 합침  
[5, 6] / [3] / [4, 7] / [2]  
[3, 5, 6] / [2, 4 ,7]  
[2, 3, 4, 5, 6, 7]  

[3, 5, 6] / [2, 4 ,7]  
[2, 3, 4, 5, 6, 7]  
여기에서 합쳐지는 과정을 보자면

왼쪽의 가장 첫번째 요소와 오른쪽 가장 첫번째 요소를 비교하여 더 작은 값을 리스트에 넣고,  
["3", 5, 6] / ["2", 4, 7]
["2"]
오른쪽의 값을 넣었으므로, 왼쪽의 첫번째 요소와 오른쪽의 다음요소인 두번째 요소와 비교하여 리스트에 넣는다.
["3", 5, 6] / [2, "4", 7]  
[2, "3"]  
이를 반복하면,  
[3, "5", 6] / [2, "4", 7]  
[2, 3, "4"]  
[3, "5", 6] / [2, 4, "7"]  
[2, 3, 4, "5"]  
[3, 5, "6"] / [2, 4, "7"]  
[2, 3, 4, 5, "6"]  
이렇게 되는데, 이때 왼쪽의 요소가 모두 들어갔으므로,  
오른쪽의 리스트에 남은 값들은 왼쪽 리스트의 마지막 요소보다 값이 크다는 것을 알 수 있다.  
따라서, 오른쪽 요소에 남은 값들을 모두 리스트에 넣는다.  
[2, 3, 4, 5, 6, "7"]

방금은 오른쪽 리스트에 값이 하나만 남아있어서 좋은 예시는 아니라서 다른 예시를 들자면,  
[2, 4, "6"] / [5, "7", 9]  
[2, 4, 5, "6"]  
위에서 왼쪽 리스트의 값들이 모두 들어갔으므로 오른쪽 리스트의 7부터 끝까지 리스트에 넣는다.  
[2, 4, 5, 6, 7, 9]  


## 병합정렬 구현

```py
def mergeSort(list):
    if len(list) <= 1:
        return list
    mid = int(len(list)/2)
    #print("left : ", list[:mid], " right : ", list[mid:])
    # 왼쪽 리스트와 오른쪽 리스트를 나누어 병합된 결과를 ll, rl에 저장
    ll, rl = mergeSort(list[:mid]), mergeSort(list[mid:])
    idx, li, ri = 0, 0, 0
    # ll, rl을 병합하는 부분
    while True:
        if ll[li] < rl[ri]:
            list[idx] = ll[li]
            li += 1
            idx += 1
            if li == len(ll):
            # 왼쪽 리스트를 다 넣음, 오른쪽에 남아있는 값들 처리
                for i in range(ri, len(rl)):
                    list[idx] = rl[i]
                    idx += 1
                break
        else:
            list[idx] = rl[ri]
            ri += 1
            idx += 1
            if ri == len(rl):
            # 오른쪽 리스트를 다 넣음, 왼쪽에 남아있는 값들 처리
                for i in range(li, len(ll)):
                    list[idx] = ll[i]
                    idx += 1
                break
    #print(list)
    return list
    
# 최대 1000의 랜덤값 중  100개의 값을 가진리스트를 1000번 정렬하고,
# 리스트는 출력하지 않는다.
print(checkSortFunc(mergeSort, 1000, 100, 1000))
```

병합정렬은 위와 같이 구현했다.  
ll과 rl에 mergeSort를 통해 list를 둘로 나눠서 각각 병합한 결과를 저장하고,  
ll과 rl을 병합하여 list에 저장하고, 반환하도록 했다. (원본도 변경)  

![결과](/assets/images/fastchallenge/day14/병합정렬결과.PNG)

## 병합정렬 시간복잡도

![시간복잡도](/assets/images/fastchallenge/day14/병합정렬시간복잡도.png)

노드가 한개가 될때까지 둘로 나뉘므로 깊이는 $log_2 n$이 된다.  
따라서 합쳐지는 횟수는 총 $log_2 n$번이다.  
같은 높이에서 합쳐질때 마다 정렬하는데, 이때 최대 $n$번을 하게된다.  
따라서 시간복잡도는 $(정렬할때의 비교횟수) * (합치는 횟수)$가 된다.  
시간복잡도 : $O(n log n)$이 된다.

![내용](/assets/images/fastchallenge/day14/시간복잡도강의내용.PNG)  
위 내용을 참고해도 된다.

## checkSortFunc 개선

```py
# checkSortFunc(정렬함수, 최대랜덤값, 랜덤값의 갯수, 반복(검사)횟수, 리스트출력여부)
def checkSortFunc(func, maxrand=1000 , elemcnt = 10, repeatcnt = 10, printlist = False):
    isSorted = False
    for i in range(0, repeatcnt):
        list = random.sample(range(maxrand), elemcnt)
        if printlist:
            print("raw : ", list)
        list = func(list)
        for i in range(0, len(list)-1):
            if list[i] > list[i + 1]:
                print(list)
                return False
        if printlist:
            print("sorted : ", list)
    return True
```

## 마지막

예전에 C로 병합정렬만 주구장창 구현했던 적이 있는데,  
그래서인지 도움이 많이 됬다.  
뚝딱 구현되서 다행이다.

# 내가 듣는 인강

**알고리즘 / 기술면접👉https://bit.ly/2FgOONG**
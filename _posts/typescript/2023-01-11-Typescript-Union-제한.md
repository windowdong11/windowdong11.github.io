---
title: "Typescript Union의 최대 제한 (ts2590)"
date: 2023-01-11 03:06:00 +0900
categories: typescript
toc : true
---

## 타이핑 목표 설정 - Date.toISOstring 반환값
[reference : Date.prototype.toISOstring][Date.prototype.toISOstring]
`Date.toISOstring()`의 반환 타입을 `string`이 아닌 새로운 타입으로 만들어 Response Body에 사용하면 어떨까 싶었다.  
(물론 그대로 `string`을 사용해도 문제는 없다. 하지만, 가끔 TS를 사용하다 보면 더 strict한 타입을 꿈꿀 때가 가끔 있지 않나?)  
그래서 `Date.toISOstring()`의 결과를 타입으로 만들어보고자 했다.  
포맷 : `YYYY-MM-DDTHH:mm:ss.sssZ`  
[ECMA Date Time String Format][ECMA Date Time String Format]  

## 1차 타이핑

```ts
type NumberChs = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type ISOYear = `${NumberChs}${NumberChs}${NumberChs}${NumberChs}`
type ISOMonth = Exclude<`0${NumberChs}`, '00'> | '10' | '11' | '12'
type ISODay<T extends ISOMonth> = 
  T extends '02'
    ? 'xx'
    : Exclude<`${'0' | '1' | '2'}${NumberChs}`, '00'> | '30'
      | (T extends '01' | '03' | '05' | '07' | '08' | '10' | '12' ? '31' : never);
type ISOHour = `${'0' | '1'}${NumberChs}` | `${'2'}${'0' | '1' | '2' | '3'}`
type ISOMinute = `${'0' | '1' | '2' | '3' | '4' | '5'}${NumberChs}`
type ISOSecond = ISOMinute
type ISOMilliSecond = `${NumberChs}${NumberChs}${NumberChs}`
type ISODateString<Month extends ISOMonth = ISOMonth> = `${ISOYear}-${Month}-${ISODay<Month>}T${ISOHour}:${ISOMinute}:${ISOSecond}.${ISOMilliSecond}Z`
```

## 문제 발생 - ts2590 : 너무 복잡한 union 타입

타입 정의는 위와 같이 Year, Month, Day, Hour, Minute, Second, MilliSecond를 따로 정의하고 하나로 합쳤다.  
앗 오류가 발생했다! `ts2590: expression produces a union type that is too complex to represent.`  
난생 처음 보는 오류라 찾아보니 union 타입에 원소들이 너무 많이 존재해서 발생하는 문제다.  
`0000-01-01T00:00:00.000Z` | `0000-01-01T00:00:00.001Z` | `0000-01-01T00:00:00.002Z` | ... | `9999-12-31T23:59:59.999Z` 이러한 형태로 Union 타입으로 정의된 것이라서 갯수가 약 **272조**개를 넘는다.  
오.. 타입스크립트가 아니라도 터지겠다.  

## 해결 시작 - 비슷한 질문 발견

오랜기간 검색 끝에 비슷한 질문을 찾았다. 16진수 색 코드를 타입으로 만들고자 하는 질문이다.  
[How to create standalone type for a HEX color string?](https://stackoverflow.com/questions/68766792/how-to-create-standalone-type-for-a-hex-color-string)  
여기에서 infer를 사용하는 것을 보고 응용해보았다.  

```ts
type Digits<T extends '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'> = T;
type ISOYear_<T extends string> =
    T extends `${Digits<infer D1>}${Digits<infer D2>}${Digits<infer D3>}${Digits<infer D4>}`
    ? T : never;
type ISOMonth_<T extends string> =
    T extends Exclude<`${Digits<'0'>}${Digits<infer D>}`, '00'> | '10' | '11' | '12'
    ? T : never;
type ISODay_<
  Y extends string,
  M extends string,
  T extends string
> = ISOMonth_<M> extends `${ISOMonth_<
  '01' | '03' | '05' | '07' | '08' | '10' | '12'
>}`
  ? T extends
      | Exclude<`${Digits<'0' | '1' | '2'>}${Digits<infer D>}`, '00'>
      | `30`
      | `31`
    ? T
    : never
  : ISOMonth_<M> extends `${ISOMonth_<'04' | '06' | '09' | '11'>}`
  ? T extends
      | Exclude<`${Digits<'0' | '1' | '2'>}${Digits<infer D>}`, '00'>
      | `30`
    ? T
    : never
  : ISOMonth_<M> extends `${ISOMonth_<'02'>}`
  ? ISOYear_<Y> extends ISOYear_<`
            ${Exclude<
              `${Digits<infer D1>}${Digits<infer D1>}`,
              | `${'0' | '2' | '4' | '8'}${'0' | '4' | '8'}`
              | `${`${'1' | '3' | '5' | '7' | '9'}${'2' | '6'}`}`
            >}${
      | `${'0' | '2' | '4' | '8'}${'0' | '4' | '8'}`
      | `${`${'1' | '3' | '5' | '7' | '9'}${'2' | '6'}`}`}`>
    ? T extends Exclude<`${Digits<'0' | '1' | '2'>}${Digits<infer D>}`, '00'>
      ? T
      : never
    : T extends Exclude<
        `${Digits<'0' | '1' | '2'>}${Digits<infer D>}`,
        '00' | '29'
      >
    ? T
    : never
  : never;
type ISOHour_<T extends string> =
  T extends `${Digits<'0' | '1'>}${Digits<infer D>}` | `${Digits<'2'>}${Digits<'0' | '1' | '2' | '3'>}`
  ? T : never;
type ISOMinute_<T extends string> =
  T extends `${Digits<'0' | '1' | '2' | '3' | '4' | '5'>}${Digits<infer D>}`
  ? T
  : never;
type ISOSecond_<T extends string> =
  T extends `${Digits<'0' | '1' | '2' | '3' | '4' | '5'>}${Digits<infer D>}`
  ? T
  : never;
type ISOMilliSecond_<T extends string> =
  T extends `${Digits<infer D1>}${Digits<infer D2>}${Digits<infer D3>}`
  ? T
  : never;
type ISODate_<T extends string> =
  T extends `${ISOYear_<infer Y>}-${ISOMonth_<infer M>}-${infer Rest}`
  ? Rest extends `${ISODay_<Y, M, infer D>}T${ISOHour_<infer H>}:${ISOMinute_<infer M>}:${ISOSecond_<infer S>}.${ISOMilliSecond_<infer MS>}Z`
    ? T 
    : never
  : never;
```

오! ts2590에러는 발생하지 않는다!  

## 새로운 문제 - 컴파일이 오래걸림

ts-node로 실행을 시켜보면.. 어라 10초 뒤에 결과가 나타난다.  
TS는 컴파일 할 때, string literal union 타입을 생성하느라 시간이 걸리긴 하지만, infer 키워드를 통해 생성했기 때문에, 이전처럼 모든 경우가 생성되지 않아야 한다.  

## 컴파일 최적화 해결

`type Digits<T extends '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'> = T;`  
어라..? 설마 이것 때문인가?  
`type Digits<T extends string> = T extends '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' ? T : never;`  
이렇게 한번 바꿔보니 1초도 걸리지 않는다.  

왜일까?  
1번의 경우에는 T는 특정한 값들을 지정하고 있다. 따라서, 매번 특정한 union에 해당하는지 확인하는 과정을 거쳐서 많은 연산을 필요로 하지만, 2번의 경우에는 `string`에 해당하는지만 검사하면 된다.  
쉽게 말해서 1번 코드의 경우에는 커피 필터의 출구가 좁고, 2번의 경우에는 매우 넓기 때문에 검사하는 시간에서 차이가 나는 것이다.  

## 배운점

특히 DefinitelyTyped Express에서 `/somepath/:id` 이러한 `path`가 존재할 때, `id`를 `req.param`타입의 속성으로 넣어주는 부분이 있다. 이 부분을 보면서 제네릭에 대해서 공부를 정말 많이 했고, 특히 `infer` 키워드를 통해 타입에서 파싱을 하는 부분에 대해서 많이 배웠었다.  
이번에는 최적화를 하는 방법을 많이 배운 것 같다.
1. `` `${infer D}` ``와 같이 `D` 타입을 사용하지 않지만 컴파일 최적화가 가능한 부분
2. 제네릭을 사용할 때에는 `<T extends 'a' | 'b' | 'c'>`보다는 `<T extends string>`와 `T extends 'a' | 'b' | 'c' ? T : never`이 컴파일 최적화 면에서 더 좋다.
이번 타입 정의를 통해서 컴파일 시간 최적화에 대해 고민해볼 수 있는 기회가 생겼고, 리터럴 문자열 타입과 `infer` 키워드에 대한 이해도가 높아진 것 같다.

[Date.prototype.toISOstring]: https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.toisostring
[ECMA Date Time String Format]: https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format
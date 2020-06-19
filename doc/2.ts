interface Person {
  name: string
}

// 指定函数中的this的类型
function my(this: Person) {
  console.log(this);
  
}

let p: Person = {name: 'jw'}
my.apply(p)

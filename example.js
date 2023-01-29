const emailKey= 'email';
const myinfor= {
    name:'Nam Nguyenn',
    age: 18,// thuoc tinh 
    address:"Ha Nam",
    [emailKey]: 'nam@gmail.com',
    getName: function() {// phuong thuc 
        return this.name
    }
}
// tuong tac voi objetc ben ngoai 
console.log(myinfor[emailKey])
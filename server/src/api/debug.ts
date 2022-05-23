import Room from './Room';

const testRoom = new Room('test');
['user1', 'user2', 'user3', 'user4'].forEach((u) => testRoom.addUser(u));
testRoom.submitCode('user1', `
function test(b = 'hi') {
  const a = 'testing';
  console.log(a);
}`);
testRoom.submitCode('user2', `
const test = (c = 'hi') => {
  const a = 'testing';
  console.log(a);
}`);
testRoom.submitCode('user3', `
function hello (c, c = 'c', d = 2) {
  var a = "testing";
  console.log(a);
}`);
testRoom.submitCode('user4', `
function hello() {
  const a = "Hello";
  let b = a;
  var c = 21;
  d = "Hello";
  let e;
}`);

export default testRoom;

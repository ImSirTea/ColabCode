import Room from './Room';

const testRoom = new Room('test');
['user1', 'user2', 'user3'].forEach((u) => testRoom.addUser(u));
testRoom.submitCode('user1', `
function test(b = 'hi') {
  const a = 'testing';
  console.log(a);
}

function b() {
  console.log('a', a);
}`);
testRoom.submitCode('user2', `
const test = (c = 'hi') => {
  const a = 'testing';
  console.log(a);
}`);
testRoom.submitCode('user3', `
function hello (a, c = 'c', d = 2) {
  var a = "testing";
  console.log(a);
}`);

export default testRoom;

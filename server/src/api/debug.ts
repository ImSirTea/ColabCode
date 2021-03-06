import Room from './Room';

const testRoom = new Room('test');
['user1', 'user2', 'user3'].forEach((u) => testRoom.addUser(u));
testRoom.submitCode('user1', `
function test(b = 'hi') {
  const a = 'testing';
  console.log(a);
  const aVeryLongNamedVariableHere = "mm yes very long";
}

function b() {
  
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

export default testRoom;

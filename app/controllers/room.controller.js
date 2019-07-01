import connect from '../../config/db';
import Model from '../model/room';
import User from '../model/user';

const userJoinRoom = (roomName, rooms, user, socket) => {
  if (roomName === 'default') socket.join(roomName);
  else if (rooms.whiteList.includes(user._id)) {
    socket.join(roomName);
  } else {
    // TODO: implement functional
  }
};

const userCreateRoom = (socket, roomName, user) => {
  const room = new Model({
    roomName,
    whiteList: user._id,
  });
  socket.join(roomName);
  return room.save();
};

export const create = (roomName, userName, socket) => {
  let room;
  connect.then(() => {
    User.findOne({ name: userName })
      .then((user) => {
        !roomName ? room = 'default' : room = roomName;
        Model.findOne({ roomName: room })
          .then((rooms) => {
            rooms
              ? userJoinRoom(room, rooms, user, socket)
              : userCreateRoom(socket, room, user);
          });
      });
  });
};

export const addUser = (roomName, userName) => {
  connect.then(() => {
    User.findOne({ name: userName })
      .then((user) => {
        Model.findOneAndUpdate(
          { roomName },
          { $push: { whiteList: user._id } },
          { safe: true, upsert: true },
          (err) => {
            console.error(err);
          },
        );
      });
  });
};

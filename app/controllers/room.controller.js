import connect from '../../config/db';
import Model from '../model/room';
import User from '../model/user';

export const create = (roomName, userName, socket) => {
  connect.then(() => {
    User.findOne({ name: userName })
      .then((user) => {
        Model.findOne({ roomName })
          .then((rooms) => {
            if (rooms) {
              if (rooms.whiteList.includes(user._id)) {
                socket.join(roomName);
              } else {
                // TODO: implement functional
              }
            } else {
              const room = new Model({
                roomName,
                whiteList: user._id,
              });
              socket.join(roomName);
              return room.save();
            }
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

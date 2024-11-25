// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;


contract ToDoApp {

    struct Task {
        uint id;
        string text;
        bool isDeleted;
    }

    event AddTask(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;


    function addTask(string memory _taskText, bool _isDeleted) public  {
        uint _taskId = tasks.length;
        tasks.push(Task(_taskId, _taskText, _isDeleted));
        taskToOwner[_taskId] = msg.sender;

        emit AddTask(msg.sender, _taskId);
    }

    function getMyTask() public view returns (Task[] memory) {
        Task[] memory _temp = new Task[](tasks.length);
        uint _count = 0;

        for (uint _i=0; _i<tasks.length; _i++) {
            if(taskToOwner[_i] == msg.sender && tasks[_i].isDeleted == false) {
                _temp[_count] = tasks[_i];
                _count++;
            }
        }

        Task[] memory _ress = new Task[](_count);

        for (uint _i=0; _i<_count; _i++) {
            _ress[_i] = _temp[_i];
        }

        return _ress;
    }

    function deleteTask(uint _taskId, bool _isDeleted) public {
        if (taskToOwner[_taskId] == msg.sender) {
            tasks[_taskId].isDeleted = _isDeleted;
            emit DeleteTask(_taskId, _isDeleted);
        }
    }

}


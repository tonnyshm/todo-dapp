// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todo {
    struct Task {
        uint256 id;
        string description;
        bool isCompleted;
    }

    Task[] public tasks;

    function addTask(string memory _description) public {
        uint256 taskId = tasks.length;
        tasks.push(Task(taskId, _description, false));
    }

    function completeTask(uint256 _taskId) public {
        require(_taskId < tasks.length, "Task not found");
        tasks[_taskId].isCompleted = true;
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }
}

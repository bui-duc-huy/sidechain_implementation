pragma solidity ^0.5.0;
import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokenSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function sendToken(uint256 _amount, address to) public payable {
        // calculate the number of token to buy
        uint256 tokenAmount = _amount * rate;

        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(to, tokenAmount);

        //Emit an event
        emit TokenPurchased(to, address(token), tokenAmount, rate);
    }

    function withdrawToken(uint256 _amount) public payable {
        uint256 etherAmount = _amount / rate;

        require(token.balanceOf(msg.sender) >= _amount);
        require(address(this).balance >= etherAmount);

        token.transferFrom(msg.sender, address(this), _amount);

        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseToken
 * @notice Standard ERC20 token with optional burnable and mintable features.
 *         Deployed by the BaseTokenFactory. Uses OpenZeppelin audited contracts.
 */
contract BaseToken is ERC20, Ownable {
    uint8 private _decimals;
    bool public isMintable;
    bool public isBurnable;

    event TokenMinted(address indexed to, uint256 amount);
    event TokenBurned(address indexed from, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint8 decimals_,
        bool mintable_,
        bool burnable_,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        require(bytes(name_).length > 0, "BaseToken: name cannot be empty");
        require(bytes(symbol_).length > 0, "BaseToken: symbol cannot be empty");
        require(decimals_ <= 18, "BaseToken: decimals cannot exceed 18");
        require(owner_ != address(0), "BaseToken: owner cannot be zero address");

        _decimals = decimals_;
        isMintable = mintable_;
        isBurnable = burnable_;

        // Mint initial supply to the owner
        _mint(owner_, initialSupply_ * (10 ** decimals_));
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Mint additional tokens. Only callable by owner if mintable.
     * @param to Recipient address
     * @param amount Amount of tokens (in base units)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(isMintable, "BaseToken: token is not mintable");
        require(to != address(0), "BaseToken: mint to zero address");
        require(amount > 0, "BaseToken: amount must be greater than 0");
        _mint(to, amount);
        emit TokenMinted(to, amount);
    }

    /**
     * @notice Burn tokens from caller's balance. Only if burnable.
     * @param amount Amount of tokens (in base units)
     */
    function burn(uint256 amount) external {
        require(isBurnable, "BaseToken: token is not burnable");
        require(amount > 0, "BaseToken: amount must be greater than 0");
        _burn(msg.sender, amount);
        emit TokenBurned(msg.sender, amount);
    }

    /**
     * @notice Burn tokens from an approved spender. Only if burnable.
     */
    function burnFrom(address account, uint256 amount) external {
        require(isBurnable, "BaseToken: token is not burnable");
        require(amount > 0, "BaseToken: amount must be greater than 0");
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "BaseToken: burn amount exceeds allowance");
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
        emit TokenBurned(account, amount);
    }
}

/**
 * @title BaseTokenFactory
 * @notice Factory contract for deploying BaseToken instances on Base Mainnet.
 *         Tracks all deployments per creator. Emits events for indexing.
 * @dev No private key storage. No fund custody. Fully permissionless.
 */
contract BaseTokenFactory {
    // --- Events ---
    event TokenDeployed(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 initialSupply,
        uint8 decimals,
        bool mintable,
        bool burnable,
        uint256 timestamp
    );

    // --- State ---
    /// @notice All tokens deployed through this factory
    address[] public allDeployedTokens;

    /// @notice Tokens deployed per creator wallet
    mapping(address => address[]) public tokensByCreator;

    /// @notice Token metadata record
    struct TokenRecord {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 initialSupply;
        uint8 decimals;
        bool mintable;
        bool burnable;
        uint256 deployedAt;
    }

    mapping(address => TokenRecord) public tokenRecords;

    // --- Deployment fee (optional, set to 0 for free) ---
    uint256 public constant DEPLOYMENT_FEE = 0;

    /**
     * @notice Deploy a new ERC20 token. The caller becomes the owner.
     * @param name Token name (e.g. "My Token")
     * @param symbol Token ticker (e.g. "MTK")
     * @param initialSupply Total supply before decimals (e.g. 1000000 = 1M)
     * @param decimals_ Number of decimals (0-18)
     * @param mintable Whether owner can mint additional tokens
     * @param burnable Whether holders can burn tokens
     * @return tokenAddress The address of the newly deployed token
     */
    function deployToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply,
        uint8 decimals_,
        bool mintable,
        bool burnable
    ) external payable returns (address tokenAddress) {
        // Input validation
        require(bytes(name).length > 0 && bytes(name).length <= 64, "Factory: invalid name length");
        require(bytes(symbol).length > 0 && bytes(symbol).length <= 12, "Factory: invalid symbol length");
        require(initialSupply > 0 && initialSupply <= 1_000_000_000_000, "Factory: invalid supply range");
        require(decimals_ <= 18, "Factory: decimals cannot exceed 18");
        require(msg.value >= DEPLOYMENT_FEE, "Factory: insufficient deployment fee");

        // Deploy token — caller (msg.sender) is the owner
        BaseToken token = new BaseToken(
            name,
            symbol,
            initialSupply,
            decimals_,
            mintable,
            burnable,
            msg.sender
        );

        tokenAddress = address(token);

        // Track deployment
        allDeployedTokens.push(tokenAddress);
        tokensByCreator[msg.sender].push(tokenAddress);
        tokenRecords[tokenAddress] = TokenRecord({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            initialSupply: initialSupply,
            decimals: decimals_,
            mintable: mintable,
            burnable: burnable,
            deployedAt: block.timestamp
        });

        emit TokenDeployed(
            tokenAddress,
            msg.sender,
            name,
            symbol,
            initialSupply,
            decimals_,
            mintable,
            burnable,
            block.timestamp
        );

        // Refund excess ETH
        if (msg.value > DEPLOYMENT_FEE) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - DEPLOYMENT_FEE}("");
            require(success, "Factory: ETH refund failed");
        }
    }

    /**
     * @notice Get all tokens deployed by a specific creator
     */
    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return tokensByCreator[creator];
    }

    /**
     * @notice Get total number of tokens deployed through this factory
     */
    function getTotalDeployed() external view returns (uint256) {
        return allDeployedTokens.length;
    }

    /**
     * @notice Get full record for a deployed token
     */
    function getTokenRecord(address tokenAddress) external view returns (TokenRecord memory) {
        return tokenRecords[tokenAddress];
    }

    /**
     * @notice Get paginated list of all deployed tokens
     */
    function getAllTokensPaginated(uint256 offset, uint256 limit)
        external
        view
        returns (address[] memory)
    {
        uint256 total = allDeployedTokens.length;
        if (offset >= total) return new address[](0);
        uint256 end = offset + limit;
        if (end > total) end = total;
        uint256 length = end - offset;
        address[] memory result = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = allDeployedTokens[offset + i];
        }
        return result;
    }
}

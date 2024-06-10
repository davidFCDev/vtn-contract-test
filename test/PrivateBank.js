const { expect } = require("chai");

describe("PrivateBank", function () {
  let PrivateBank;
  let privateBank;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    PrivateBank = await ethers.getContractFactory("PrivateBank");
    privateBank = await PrivateBank.deploy();
  });

  it("Debe depositar ether", async function () {
    const amount = 100;
    await privateBank.deposit({ value: amount });
    const balance = await privateBank.getBalance();
    expect(balance).to.equal(amount);
  });

  it("Debe retirar ether", async function () {
    const initialBalance = 100;
    await privateBank.deposit({ value: initialBalance });
    await privateBank.withdraw();
    const balance = await privateBank.getUserBalance(addr1.address);
    expect(balance).to.equal(0);
  });

  it("Debe revertir cuando se intenta retirar con saldo insuficiente", async function () {
    await expect(privateBank.withdraw()).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("Debe actualizar el saldo del contrato después del depósito", async function () {
    const initialContractBalance = BigInt(await privateBank.getBalance());

    const depositAmount = BigInt(200);
    await privateBank.deposit({ value: depositAmount });

    const finalContractBalance = BigInt(await privateBank.getBalance());
    const expectedContractBalance = initialContractBalance + depositAmount;

    expect(finalContractBalance).to.equal(expectedContractBalance);
  });
});

import { MsgWithdrawSigned } from '../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"

/**
 * Model representing a MsgWithdrawSigned to send POKT from one account to another
 */
export class CustomMsgWithdrawSigned extends TxMsg {
    public readonly fromAddress: string
    public readonly payee: string
    public readonly signature: string
    public readonly salt: string
    public readonly amount: string
    public readonly KEY: string = "/x.bridgepool.MsgWithdrawSigned"
    public readonly AMINO_KEY: string = "bridgepool/msg_withdraw_signed"

    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} token - token
     * @param {string} amount - amount
     */
    public constructor(fromAddress: string, payee: string, signature: string, salt: string, amount: string) {
        super()
        this.fromAddress = fromAddress
        this.amount = amount
        this.payee = payee
        this.signature = signature
        this.salt = salt
        const sendAmount = Number(this.amount) || -1
        if (isNaN(sendAmount)) {
            throw new Error("sendAmount is not a valid number")
        } else if (sendAmount < 0) {
            throw new Error("sendAmount < 0")
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {object} - Msg type key value.
     * @memberof MsgSwap
     */
    public toStdSignDocMsgObj(): object {
        return { 
            type: this.AMINO_KEY, 
            value: { 
                amount: this.amount,
                fromAddress: this.fromAddress.toLowerCase(), 
                payee: this.payee.toLowerCase(),
                signature: this.signature.toLowerCase(),
                salt: this.salt.toLowerCase(),
            } 
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof CustomMsgSwap
     */
    public toStdTxMsgObj(): any {
        const data = { 
            fromAddress: Buffer.from(this.fromAddress, "hex"),
            signature: Buffer.from(this.signature, "hex"),
            amount: Number(this.amount),
            payee: this.payee.toLowerCase(),
            salt: this.salt,
        }

        const result = Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgWithdrawSigned.encode(data).finish()).toString("base64")
        });

        return result;
    }

    static decodeStdTxMsgValue(value: string): any {
        return MsgWithdrawSigned.decode(Buffer.from(value, 'base64'))
    }
}
import { MsgSwap } from '../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"

/**
 * Model representing a MsgSwap to send POKT from one account to another
 */
export class CustomMsgSwap extends TxMsg {
    public readonly fromAddress: string
    public readonly token: string
    public readonly amount: string
    public readonly targetChainId: string
    public readonly targetToken: string
    public readonly targetAddress: string
    public readonly KEY: string = "/x.bridgepool.MsgSwap"
    public readonly AMINO_KEY: string = "bridgepool/msg_swap"

    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} token - token
     * @param {string} amount - amount
     */
    public constructor(fromAddress: string, targetToken: string, targetAddress: string, targetChainId: string, amount: string, token: string) {
        super()
        this.fromAddress = fromAddress
        this.amount = amount
        this.token = token
        this.targetAddress = targetAddress
        this.targetChainId = targetChainId
        this.targetToken = targetToken
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
                token: this.token.toLowerCase()
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
            amount: Number(this.amount),
            token: this.token.toLowerCase(),
            targetAddress: this.targetAddress,
            targetChainId: this.targetChainId,
            targetToken: this.targetToken,
        }

        const result = Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgSwap.encode(data).finish()).toString("base64")
        });

        return result;
    }

    static decodeStdTxMsgValue(value: string): any {
        return MsgSwap.decode(Buffer.from(value, 'base64'))
    }
}
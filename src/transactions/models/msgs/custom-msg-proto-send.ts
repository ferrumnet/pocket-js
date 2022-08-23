import { MsgSend, CustomMsgSend, MsgSetFee } from '../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class CustomMsgSetFee extends TxMsg {
    public readonly fromAddress: string
    public readonly token: string
    public readonly fee: string
    public readonly KEY: string = "/x.bridgepool.MsgSetFee"
    public readonly AMINO_KEY: string = "bridgepool/msg_set_fee"

    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} fee - Destination address
     * @param {string} token - Amount to be sent, needs to be a valid number greater than 0
     * @param {CoinDenom | undefined} amountDenom  - Amount value denomination
     */
    public constructor(fromAddress: string, fee: string, token: string) {
        super()
        this.fromAddress = fromAddress
        this.fee = fee
        this.token = token
        const feeNumber = Number(this.fee) || -1
        if (isNaN(feeNumber)) {
            throw new Error("Fee is not a valid number")
        } else if (feeNumber < 0) {
            throw new Error("fee < 0")
        }
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {object} - Msg type key value.
     * @memberof MsgSend
     */
    public toStdSignDocMsgObj(): object {
        return { 
            type: this.AMINO_KEY, 
            value: { 
                fee: this.fee,
                from_address: this.fromAddress.toLowerCase(), 
                token: this.token.toLowerCase()
            } 
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof CustomMsgSend
     */
    public toStdTxMsgObj(): any {
        const data = { fromAddress: Buffer.from(this.fromAddress, "hex"), token: this.token, fee10000: Number(this.fee) }

        const result = Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgSetFee.encode(data).finish()).toString("base64")
        });

        return result;
    }

    static decodeStdTxMsgValue(value: string): any {
        return MsgSetFee.decode(Buffer.from(value, 'base64'))
    }
}
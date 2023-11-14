import io from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}`, {
    transports: ['polling']
})

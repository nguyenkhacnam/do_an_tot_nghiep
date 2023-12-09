import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import * as accountSlice from '../redux/slices/accountSlice'

//register test
test("Register test", async () => {
    const data = {
        phoneNumber: "0111111111",
        name: "Unit Test 1",
        dob: "1/1/2000",
        avatar: "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
        email: "UnitTest1@gmail.com",
        password: "UnitTest1",
        address: "Viet nam",
        role: "customer",
        sex: "male",
    }
    // const dispatch = useDispatch()
    try {
        const resultAction = await accountSlice.register({ data })
        const originalPromiseResult = unwrapResult(resultAction)
        expect(originalPromiseResult.status).toBe(200)
    } catch (rejectedValueOrSerializedError) {
    }
})

test("Register test", async () => {
    const data = {
        phoneNumber: "0111111111",
        name: "Unit Test 2",
        dob: "1/1/2000",
        avatar: "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
        email: "cuscus7cus7@gmail.com",
        password: "UnitTest2",
        address: "Viet nam",
        role: "customer",
        sex: "male",
    }
    try {
        const resultAction = await accountSlice.register({ data })
        const originalPromiseResult = unwrapResult(resultAction)
        expect(originalPromiseResult.status).toBe(409)
    } catch (rejectedValueOrSerializedError) {
    }
})

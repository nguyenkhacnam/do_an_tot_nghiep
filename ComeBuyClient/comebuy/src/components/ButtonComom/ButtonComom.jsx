import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

const ButtonCommon = () => {
    return (
        <Button type="primary" icon={<FilterOutlined />}
            size='large'
        >
            Lọc nâng cao
        </Button>
    )
}

export default ButtonCommon
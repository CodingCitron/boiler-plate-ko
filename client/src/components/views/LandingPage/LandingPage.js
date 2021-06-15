import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage() {

    useEffect(() => {
        console.log('어디가 에러야?')
        axios.get('/api/hello')
        .then(response => {console.log(response)})
    }, [])

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh'
        }}>
            시작 페이지
        </div>
    )
}

export default LandingPage

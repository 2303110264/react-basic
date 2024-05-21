import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ClassKakaoMap extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {
        const memberList = [
            { name: 'dq', email: 'admin@test.com' },
            { name: '사용자', email: 'user@test.com' },
        ];

        return (
            <div>
                {memberList.map((member) => <div style={{border:'2px solid white'}} key={member.email}>{member.name}</div>)}
                {/*렌더링 문제로 forEach는 주석처리*/
                /*memberList.forEach((member) => <div key={member.email}>{member.name}</div>)*/}
            </div>
        );
    }
}

ClassKakaoMap.propTypes = {};
export default ClassKakaoMap;
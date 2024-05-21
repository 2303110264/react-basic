/*
1) constructor(props) 
    {클래스 초기화-useState 초기화 및 bind()바인딩}
2) componentWillMount() 
    {화면 렌더링 전 실행-setState()값 할당}
3) render() 
    { return(JSX태그-HTML); -화면 렌더링-출력 구현}
4) componentDidMount() 
    {화면 렌더링 후 실행}
5) componentWillUnmount() 
    {현재 클래스 언마운트(접속이 끊어질 때) 시 실행}
-------------------- 화면 업데이트 갱신 시 실행(아래) -----------------------
1) componentWillReceiveProps(nextProps) 
    {상위 컴포넌트의 props값이 변경 되었을 때 실행}
2) shouldComponentUpdate(nextProps, nextState) 
    {return true; 화면업데이트-재 렌더링}
3) componentWillUpdate(nextProps, nextState) 
    {화면업데이트갱신 전}
4) render() 
    { return(JSX태그-HTML); -화면 렌더링-출력 구현}
5) componentDidUpdate(prevProps, prevState) 
    {화면업데이트갱신 후}
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BtnEventComponent extends Component {
    constructor(props) {

        console.log('순서-constructor');

        super(props);
        this.state = {count: props.count}; //BtnEventComponent.jsx 파일에 코드 추가
        this.clickEvent = this.clickEvent.bind(this);//this를 바인딩하면, clickEvent함수에서 this를 사용할 수 있다.

    }
    clickEvent() {
        //state 변경 let count = this.state.count;
        this.setState(prevState => ({ //prevState는 단순히 변수 선언임
            count: prevState.count+1,
        }));
        } //setState로 변경해야 화면에 렌더링 된다.
    componentWillMount() {
        console.log('순서- componentWillMount');
    }

    componentDidMount() {
        console.log('순서- componentDidMount');
    }

    componentWillReceiveProps(nextProps) {
        console.log('순서- componentWillReceiveProps');
        this.setState({count: nextProps.count});
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('순서- shouldComponentUpdate');
        return true; // 없으면 카운트 올라가지 않음...
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('순서- componentWillUpdate');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('순서- componentDidUpdate');
    }

    componentWillUnmount() {
        console.log('순서- componentWillUnmount');
    }

    render() {
        console.log('순서- render ');
        const{
            nodeValue
        } = this.props; //넘어온 변수 추가

        return (
            <div>
                <p>카운트: {this.state.count}</p>
                <button onClick={this.clickEvent}>카운트 증가</button>
                {nodeValue}
            </div>
        );
    }
}

BtnEventComponent.propTypes = {

};

export default BtnEventComponent;
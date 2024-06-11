/*global kakao*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, json } from "react-router-dom";

class KakaoMap extends Component {
    constructor(props) {
        super(props); //부모클래스-Component의 props속성을 사용하겠다고 선언, 필수 이다.
        //현재 클래스의 state 상태변수값 초기화
        this.state = {
            keyword: '성남시', //검색어 상태 입력예
            pageNo: 1,
            totalCount: 0,
        } //json 1차원 데이터 객체. getData 함수에서 this클래스객체를 사용하기위해 아래코드 추가
        this.getData = this.getData.bind(this);//this 바인딩
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removeAllChildNods = this.removeAllChildNods.bind(this);
        this.repeatPage = this.repeatPage.bind(this);
        this.onPage = this.onPage.bind(this);
    }
    repeatPage(totalCount) { //검색된 전체 갯수를 10개씩 나누어 출력될 디자인 페이지를 구한다.
        var pagingNo = Math.ceil(this.state.totalCount / 10);
        var arr = [];
        for (var i = 1; i <= pagingNo; i++) {
            arr.push(
                <option key={i} value={i}>{i}</option>
            );
        }
        return arr;
    }
    onPage = (e) => { //페이지 선택 이벤트 함수
        this.setState({ [e.target.id]: e.target.value });//화면처리
        this.state.pageNo = e.target.value;//js처리
        var mapContainer = document.getElementById('map');
        this.removeAllChildNods(mapContainer);//기존 카카오맵 겍체 지우기
        this.getData();
    };
    removeAllChildNods(el) { //기존 지도 지우기
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
    onSearch() { // 검색 버튼 이벤트 함수
        var mapContainer = document.getElementById('map');
        this.removeAllChildNods(mapContainer);//기존 카카오맵 겍체 지우기
        this.state.pageNo = 1;//js처리
        this.getData();
    }
    onChange(e) { // 검색어 수정 이벤트 함수
        this.setState({ [e.target.id]: e.target.value });//화면처리-재랜더링
        this.state.keyword = e.target.value;//js처리
    }

    getData() {
        var url = 'http://localhost:4000/openapi/getdata?keyword=' + this.state.keyword + '&pageNo=' + this.state.pageNo;;
        fetch(url, { method: 'get' }) //체인방식으로 실행. 장점은 줄 순서대로 각각 실행 결과가 마무리 된 후 다음 줄이 실행 된다.
            .then(response => response.json()) //응답데이터를 json 형태로 변환
            .then(contents => { //json으로 변환된 응답데이터인 contents 를 가지고 구현하는 내용
                this.state.totalCount = contents['response']['body']['totalCount']['_text'];//js처리
                this.setState({ totalCount: contents['response']['body']['totalCount']['_text'] });//화면처리
                var positions = [];//배열 선언
                var jsonData;
                jsonData = contents['response']['body']['items'];
                console.log(jsonData);
                jsonData['item'].forEach((element) => {//람다식 사용 function(element) {}
                    positions.push(
                        {
                            content: "<div>" + element["csNm"]['_text'] + "</div>",//충전소 이름
                            latlng: new kakao.maps.LatLng(element["lat"]['_text'], element["longi"]['_text']) // 위도(latitude), 경도(longitude)
                        }
                    );
                });
                //구현코드 이곳에 위 카카오 맵 샘플 js 코드를 그대로 입력한다.
                var index = parseInt(positions.length / 2);//배열은 인덱스순서 값을 필수로 가지고, 여기서는 반환 값의 개수로 구한다.
                console.log(jsonData["item"][index]["lat"]['_text']);
                //console.log(jsonData);
                var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
                    mapOption = {
                        center: new kakao.maps.LatLng(jsonData["item"][index]["lat"]['_text'], jsonData["item"][index]["longi"]['_text']),
                        //center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                        level: 10 // 지도의 확대 레벨
                    };
                var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
                var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

                for (var i = 0; i < positions.length; i++) {
                    // 마커 이미지의 이미지 크기 입니다
                    var imageSize = new kakao.maps.Size(24, 35);

                    // 마커 이미지를 생성합니다    
                    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                    // 마커를 생성합니다
                    var marker = new kakao.maps.Marker({
                        map: map, // 마커를 표시할 지도
                        position: positions[i].latlng, // 마커의 위치
                        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                        image: markerImage // 마커 이미지
                    });

                    // 마커에 표시할 인포윈도우를 생성합니다 
                    var infowindow = new kakao.maps.InfoWindow({
                        content: positions[i].content // 인포윈도우에 표시할 내용
                    });

                    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
                    // 이벤트 리스너로는 클로저를 만들어 등록합니다 
                    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
                }

                // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
                function makeOverListener(map, marker, infowindow) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }

                // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
                function makeOutListener(infowindow) {
                    return function () {
                        infowindow.close();
                    };
                }

            })
            .catch((err) => console.log('에러: ' + err + '때문에 접속할 수 없습니다.'));// then(content) 끝
    } // getData() 끝
    componentDidMount() { // 생명주기 중 초기 화면 렌더링 후 실행함수
        this.getData();
    }

    render() {
        //props-상태 값이 바뀌면 html을 그리는 함수 즉, render 자동으로 재 실행됨
        //아래  div 내 에 위 카카오 맵 샘플 js 의 html 부분을 복사해서 사용 단, style은 JSX 전용으로 해야 하는것에 주의한다
        return (
            <div>
                <h2><a href="/">클래스형 전기차 충전소 위치</a></h2>
                <span>충전소 도시 검색(아래 검색할 시를 입력하고 검색 버튼을 누른다.)</span>
                <input className="form-control" type="text" id="keyword" onChange={this.onChange}
                    value={this.state.keyword} />
                <input className="form-control btn btn-primary" type="button" onClick={this.onSearch} value="검색" />
                <span>페이지이동(아래 번호를 선택하면 화면이 전환된다.)</span><select className="form-select"
                    id="pageNo" onChange={this.onPage} value={this.state.pageNo}>

                    {this.repeatPage(this.state.totalCount)}

                </select>
                <Link to="/"><button className="form-control btn btn-primary" id="btnHome">홈으로</button></Link>
                <div id="map" style={{ width: "100%", height: "70vh" }}></div>
                <div id="map" style={{ width: "100%", height: "100vh" }}></div>
            </div >
        );//return 함수 끝
    }//reder 함수 끝
}//클래스 끝
KakaoMap.propTypes = {
};
export default KakaoMap;
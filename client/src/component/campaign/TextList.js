import { useNavigate } from 'react-router-dom';

const TextList = ({campaignList}) => {
  const navigate = useNavigate();

  // 이미지 태그의 src 속성값을 추출하는 함수
  const extractImageSrc = (htmlString) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const imgTags = tempElement.getElementsByTagName('img');
    const srcList = [];
    for (let i = 0; i < imgTags.length; i++) {
      srcList.push(imgTags[i].getAttribute('src'));
    }
    return srcList;
  };

  // campaignList.body 내부의 이미지 src 추출
  const imageSrcList = extractImageSrc(campaignList.body);

  return (
    <button className="cont" onClick={()=>{navigate(`/campaign/detail/${campaignList.id}`)}}>
      {/* <div className="img-wrap img-resize-w">
        {console.log(campaignList.body)}
      </div> */}
      {/* <div className="img-wrap img-resize-w">
        <img src={process.env.PUBLIC_URL + '/img/img-campaign-def.jpg'}/>
      </div> */}

      <div className="img-wrap">
        {imageSrcList.length > 0 ? (
          imageSrcList.map((src, index) => (
            <img key={index} src={src} alt={`Image ${index}`} />
          ))
        ) : (
          <img src={process.env.PUBLIC_URL + '/img/img-campaign-def.jpg'} alt="Default Campaign Image" />
        )}
      </div>

      <div className="txt-wrap">
        <p className="title">{campaignList.title}</p>
        {/* <p className="title">{
          campaignList.title.length > 20 
            ? campaignList.title.slice(0, 20) + "..."
            : campaignList.title
        }</p> */}
        <div className="txt-info">
          <p className="username">{campaignList.username}</p>
          <p className="date">{campaignList.date.slice(0, 10).replace('T', ' ')}</p>
        </div>
      </div>
      
    </button>
  )
}

export default TextList;
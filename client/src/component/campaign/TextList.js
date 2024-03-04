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

  // 캠페인 종료 날짜와 오늘 날짜 비교
  const today = new Date(new Date().toUTCString());
  const campaignEndDate = new Date(campaignList.end_date);
  campaignEndDate.setDate(campaignEndDate.getDate() + 1);
  const isCampaignInProgress = campaignEndDate >= today;

  // 접수중인 캠페인일 경우 노출되는 badge
  const renderBadge = () => {
    if(isCampaignInProgress){
      return <span className="badge inprogress">접수중</span>
    } else {
      return <span className="badge completed">마감</span>
    }
  }
  
  return (
    <button className="cont" onClick={()=>{navigate(`/campaign/detail/${campaignList.id}`)}}>
      <div className="img-wrap">
        {imageSrcList.length > 0 ? (
          imageSrcList.map((src, index) => (
            <img key={index} src={src} alt={`Image ${index}`} />
          ))
        ) : (
          <img src={process.env.PUBLIC_URL + '/img/img-campaign-def.jpg'} alt="Default Campaign Image" />
          )}
          
        {/* 캠페인 진행상태 뱃지 */}
        {renderBadge()}
      </div>

      <div className="txt-wrap">
        <p className="title">{campaignList.title}</p>
        <div className="txt-info">
          <p className="username">{campaignList.username}</p>
          {/* {console.log(campaignList.start_date)} */}
          <p className="date">{campaignList.date.slice(0, 10).replace('T', ' ')}</p>
        </div>
      </div>
      
    </button>
  )
}

export default TextList;
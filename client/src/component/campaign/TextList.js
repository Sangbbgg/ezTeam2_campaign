import { useNavigate } from 'react-router-dom';
// import bg from '../../../public/img/img-campaign.png';

const TextList = ({campaignList}) => {
  const navigate = useNavigate();
  return (
    <button className="cont" onClick={()=>{navigate(`/campaign/detail/${campaignList.id}`)}}>
      <div className="img-wrap img-resize-w">
        <img src={process.env.PUBLIC_URL + '/img/img-campaign-def.jpg'}/>
      </div>

      <div className="txt-wrap">
        <p className="title">{
          campaignList.title.length > 20 
            ? campaignList.title.slice(0, 20) + "..."
            : campaignList.title
        }</p>
        <div className="txt-info">
          <p className="username">{campaignList.username}</p>
          <p className="date">{campaignList.date.slice(0, 10).replace('T', ' ')}</p>
        </div>
      </div>
      
    </button>
  )
}

export default TextList;
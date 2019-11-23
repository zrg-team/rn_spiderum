import { connect } from 'react-redux'
import Categories from '../components/Categories'
import handlers from '../handlers'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  return {
    data: [
      {
        title: 'Quan điểm - Tranh luận',
        image: 'business',
        url: 'https://spiderum.com/s/quan-diem-tranh-luan'
      },
      {
        title: 'Truyền cảm hứng',
        image: 'inspirational',
        url: 'https://spiderum.com/s/truyen-cam-hung'
      },
      {
        title: 'Khoa học - Công nghệ',
        image: 'laptop',
        url: 'https://spiderum.com/s/quan-diem-tranh-luan'
      },
      {
        title: 'Science2vn',
        image: 'universe',
        url: 'https://spiderum.com/s/science2vn'
      },
      {
        title: 'Thể thao',
        image: 'sport',
        url: 'https://spiderum.com/s/the-thao'
      },
      {
        title: 'Game',
        image: 'game',
        url: 'https://spiderum.com/s/game'
      },
      {
        title: 'Sự kiện Spiderum',
        image: 'event',
        url: 'https://spiderum.com/s/su-kien-spiderum'
      },
      {
        title: 'Otakulture',
        image: 'otakulture',
        url: 'https://spiderum.com/s/otakulture'
      },
      {
        title: 'Sáng tác',
        image: 'composition',
        url: 'https://spiderum.com/s/sang-tac'
      },
      {
        title: 'Comics',
        image: 'comics',
        url: 'https://spiderum.com/s/comics'
      },
      {
        title: 'Phim',
        image: 'film',
        url: 'https://spiderum.com/s/phim'
      },
      {
        title: 'Sách',
        image: 'books',
        url: 'https://spiderum.com/s/sach'
      },
      {
        title: 'Du lịch - Ẩm thực',
        image: 'entertainment',
        url: 'https://spiderum.com/s/an-choi'
      },
      {
        title: 'Kỹ năng',
        image: 'work',
        url: 'https://spiderum.com/s/ky-nang'
      },
      {
        title: 'Âm nhạc',
        image: 'music',
        url: 'https://spiderum.com/s/am-nhac'
      }
    ]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)

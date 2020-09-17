<template>
  <div>
    <el-dialog title="请用鼠标点击地图或移动蓝色气泡选择地址" :close-on-click-modal='false' :show-close="false" :visible.sync="dialogMapVisible" width="70%">
      <div>
        <div class="searchCity">
          <el-input v-model="keyword" placeholder="请输入城市+地点关键词进行搜索，如：北京天安门"/>
          <el-button type="primary" @click="searchCity">搜索</el-button>
          <span style="line-height: 40px;padding-left: 20px">当前位置：{{address}}</span>
        </div>
        <div style="text-align: center;font-size: 25px">{{msg}}</div>
        <div id="qqmap" class="mapLib"/>
        <div slot="footer" class="right" style="padding-top: 20px">
          <el-button @click="closeVisible">取 消</el-button>
          <el-button type="primary" @click="setLoaction">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'Qqmap',
    props:{
      dialogMapVisible:{
        type:Boolean,
        required:false,
      },
      latitude:{
        type:Number,
        required:'',
      },
      longitude:{
        type:Number,
        required:'',
      },
      address:{
        type:String,
        required:'',
      },
      province:{
        type:String,
        required:'',
      },
      city:{
        type:String,
        required:'',
      },
    },
    data() {
      return {
        keyword: '',
        map: null,
        geoCoder: null,
        searchService: null,
        startLocation: null,
        centerCircle: null,
        areaId: 0,
        marker: null,
        // latitude: null,
        // longitude: null,
        msg: '正在定位，请稍后...',
        icon:null,
        location:null
      }
    },
    created() {
      this.getMyLocation()
    },
    methods: {
      closeVisible(){
        this.$emit('changeVisible', 0)
      },
      setLoaction(){
        console.log(this.loaction,6666)

        this.$emit('setLoaction',{address:this.loaction.address,lat:this.loaction.lat,lng:this.loaction.lng})
      },
      getMyLocation() {
        let geolocation = new qq.maps.Geolocation('5HPBZ-ZXWEX-W3V4B-ZBQZN-NH7D2-H5FZ7', '工银诚e金')
        geolocation.getIpLocation(this.showPosition, this.showErr)
      },
      showPosition(position) {
        this.msg = ''
        if(!this.latitude){
          this.latitude = position.lat
          this.longitude = position.lng
        }
        this.init()
      },
      showErr() {
        console.log('定位失败')
        this.getMyLocation()//定位失败再请求定位，测试使用
      },
      init() {
        console.log(this.latitude, this.longitude,789456)
        let center = new qq.maps.LatLng(this.latitude, this.longitude)
        const mapDiv = document.getElementById('qqmap')
        this.map = new qq.maps.Map(mapDiv, {
          center: center,
          zoom: 16,
          zoomControl: false,
          scaleControl: false,
          mapTypeControl: false
        })

        this.geoCoder = new qq.maps.Geocoder()
        this.marker = new qq.maps.Marker({
          position: center,
          draggable: true,
          map: this.map,
          // icon:this.icon
        })
        // this.marker.setIcon(this.icon);
        console.log(this.marker)
        //点击地图
        qq.maps.event.addListener(this.map, 'click', event=> {
          this.meth(event)
        })
        //移动蓝色气泡
        qq.maps.event.addListener(this.marker, 'dragend', event=> {
          this.meth(event)
        })
        // poi搜索
        this.searchService = new qq.maps.SearchService({
          complete: results => {
            console.log('this.marker', this.marker)

            // 设置回调函数参数
            var pois = results.detail.pois
            var infoWin = new qq.maps.InfoWindow({
              map: this.map
            })
            console.log(results,999)
            this.latitude = results.detail.pois[0].latLng.lat
            this.longitude = results.detail.pois[0].latLng.lng
            center = new qq.maps.LatLng(this.latitude, this.longitude)
            console.log(center,1000)
            this.map.setCenter(center)
            this.marker.setPosition(center)
            this.getMarkerAddress(result => {
              this.address=result.detail.address
              this.province=result.detail.addressComponents.province
              this.city=result.detail.addressComponents.city

            })
            const _this = this
            var latlngBounds = new qq.maps.LatLngBounds()
            for (var i = 0, l = pois.length; i < l; i++) {
              var poi = pois[i]
              // 扩展边界范围，用来包含搜索到的Poi点
              latlngBounds.extend(poi.latLng);

              ((n) => {
                // this.marker = new qq.maps.Marker({
                //   map: this.map,
                //   draggable: true,
                //   // icon:this.icon
                // })
                // this.marker.setPosition(pois[n].latLng)
                //
                // qq.maps.event.addListener(this.marker, 'dragend', () => {
                //   this.getMarkerAddress(result => {
                //     this.$emit('moveEnd', result)
                //   })
                // })
              })(i)
            }
            // 调整地图视野
            this.map.fitBounds(latlngBounds)
          }
        })
      },
      meth(event){
        this.latitude = event.latLng.getLat()
        this.longitude = event.latLng.getLng()
        let center = new qq.maps.LatLng(this.latitude, this.longitude)
        this.map.setCenter(center)
        this.marker.setPosition(center)
        this.getMarkerAddress(result => {
          this.address=result.detail.address
          this.province=result.detail.addressComponents.province
          this.city=result.detail.addressComponents.city
          result.detail.location.address=result.detail.address
          result.detail.location.province=result.detail.addressComponents.province
          result.detail.location.city=result.detail.addressComponents.city
          this.loaction=result.detail.location
          console.log(result,result.detail.address,777777)
        })

        // setTimeout(() => {
        //   this.$emit('loaded')
        // }, 1000)

      },
      addMarker: function(position, iconImage, w, h) {
        var anchor = new qq.maps.Point((w || 40) / 2, (h || 40) / 2),
          size = new qq.maps.Size(w || 40, h || 40),
          origin = new qq.maps.Point(0, 0),
          scaleSize = new qq.maps.Size(w || 40, h || 40),
          icon = new qq.maps.MarkerImage(
            iconImage,
            size,
            origin,
            anchor,
            scaleSize
          )
        var marker = new qq.maps.Marker({
          icon: icon,
          map: this.map,
          position: position
        })
        return marker
      },
      getCenter() {
        const center = this.map.getCenter()
        this.center = [center.lng, center.lat]
        return center
      },
      setDefaultMarkerPosition(position) {
        this.marker.setPosition(position)
        this.map.setCenter(position)
      },
      getAddress(func) {
        this.geoCoder.getAddress(this.getCenter())
        this.geoCoder.setComplete(func)
      },
      getMarkerAddress(func) {
        this.geoCoder.getAddress(this.marker.getPosition())
        this.geoCoder.setComplete(func)
      },
      searchCity() {
        if (!this.keyword) {
          this.$message.error('请输入搜索地区')
          return false
        }

        this.searchService.search(this.keyword)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">

  .mapLib {
    width: 100%;
    height: 400px;
  }

  .searchCity {
    display: flex;
    margin-bottom: 2rem;

    .el-input {
      width: 30%;
      margin-right: 1rem;
    }

    .el-input__inner::-webkit-input-placeholder {
      color: gray;
    }

    .el-input__inner::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: gray;
    }

    .el-input__inner:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: gray;
    }

    .el-input__inner:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: gray;
    }

  }
</style>

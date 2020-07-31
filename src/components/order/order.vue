<template>
  <div>
    <!--面包屑导航--->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="this.getOrderList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        border
        stripe
        :data="orderList"
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="140px"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          prop="pay_status"
          width="140px"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-if="scope.row.pay_status === '1'"
            >已付款</el-tag>
            <el-tag
              type="danger"
              v-else
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
          width="140px"
        >
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showOrderDialog"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showLocationDiaolog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改收货地址对话框 -->
    <el-dialog
      title="修改收货地址"
      :visible.sync="orderVisible"
      width="50%"
      @close="orderDialogClosed"
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormRules"
        ref="editOrderFormRef"
        label-width="100px"
      >
        <el-form-item
          label="省市区县"
          prop="address1"
        >
          <el-cascader
            v-model="editOrderForm.address1"
            :options="cityData"
            clearablle
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address2"
        >
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="orderVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="orderVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查询物流信息 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close="progressDialogClosed"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="progressVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      orderVisible: false,
      editOrderForm: {
        address1: [],
        address2: ''
      },
      editOrderFormRules: {
        address1: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }
        ]
      },
      cityData,
      progressVisible: false,
      //  物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      console.log(res.data)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    showOrderDialog() {
      this.orderVisible = true
    },
    orderDialogClosed() {
      this.$refs.editOrderFormRef.resetFields()
    },
    async showLocationDiaolog() {
      const { data: res } = await this.$http.get(`/kuaidi/${1106975712662}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data
      this.progressVisible = true
    },
    progressDialogClosed() {
      this.progressInfo = []
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
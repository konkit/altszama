package altszama.app.notification
import org.bouncycastle.jce.ECNamedCurveTable
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.bouncycastle.jce.spec.ECPublicKeySpec
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.security.KeyFactory
import java.security.PublicKey
import java.security.Security
import java.util.*
import javax.validation.constraints.NotNull

@Document
data class PushNotifSubscription(
  @Id
  var id: String = "",

  @NotNull
  var endpoint: String = "",

  @NotNull
  var p256dhKey: String = "",

  @NotNull
  var authKey: String = "",

  @NotNull
  @Indexed()
  var userId: String = ""
) {

  /**
   * Returns the base64 encoded public key as a PublicKey object
   */
  fun getUserPublicKey(): PublicKey {
    // Add BouncyCastle as an algorithm provider
    if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
      Security.addProvider(BouncyCastleProvider())
    }

    val kf = KeyFactory.getInstance("ECDH", BouncyCastleProvider.PROVIDER_NAME)
    val ecSpec = ECNamedCurveTable.getParameterSpec("secp256r1")
    val point = ecSpec.curve.decodePoint(getP256dhKeyAsBytes())
    val pubSpec = ECPublicKeySpec(point, ecSpec)

    return kf.generatePublic(pubSpec)
  }

  fun getP256dhKeyAsBytes(): ByteArray {
    return Base64.getDecoder().decode(p256dhKey)
  }

  fun getAuthKeyAsBytes(): ByteArray {
    return Base64.getDecoder().decode(authKey)
  }
}
